import { ConfigService } from "@/common/config/config.service";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Request } from "express";
import moment from "moment";
import { CreatePaymentUrlDto } from "./dto/create-payment-url.dto";
import qs from "qs";
import crypto from 'crypto';
import VnpayUtils from "@/common/utils/vnpay.util";
import { DataSource, Repository } from "typeorm";
import { DepositeTransaction } from "./entities/deposite-transaction.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { REDIS_CLIENT } from "@/common/redis/redis.constants";
import { RedisClient } from "@/common/redis/redis.type";
import { HandleVnpayIpnDto } from "./dto/handle-vnpay-ipn.dto";
import { plainToInstance } from "class-transformer";
import { DepositeTransactionStatus } from "@/common/constants/deposite-transaction.constants";
import { PaymentStatus } from "@/common/constants/vnpay.constants";
import { WalletService } from "../wallet/wallet.service";
import { Wallet } from "../wallet/entities/Wallet.entity";
import FileLoaderUtils from "@/common/utils/file-loader.util";
import KeyGenerator from "@/common/utils/generate-key.util";
import { GetPaymentStatusDto } from "./dto/get-payment-status.dto";

@Injectable()
export class DepositeTransactionService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
        @Inject(REDIS_CLIENT)
        private readonly redisClient: RedisClient,
        @InjectRepository(DepositeTransaction)
        private readonly depositeTransactionRepository: Repository<DepositeTransaction>,
        private readonly walletService: WalletService
    ) { }

    async createPaymentUrl(req: Request, createPaymentUrlDto: CreatePaymentUrlDto) {
        const date = new Date();
        const orderId = `${req.user.userId}${moment(date).format('YYYYMMDDHHmmss')}`;
        const orderInfo = `Thanh toan cho ma GD: ${orderId}`;
        const hmac = crypto.createHmac("sha512", this.configService.getVnpConfig().vnpHashSecret);

        let params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': this.configService.getVnpConfig().vnpTmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': orderInfo,
            'vnp_OrderType': 'other',
            'vnp_Amount': createPaymentUrlDto.amount * 100,
            'vnp_ReturnUrl': this.configService.getVnpConfig().vnpReturnUrl,
            'vnp_IpAddr': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            'vnp_CreateDate': moment(date).format('YYYYMMDDHHmmss'),
            'vnp_BankCode': createPaymentUrlDto.bankCode,
        };
        const vnpParams = {
            ...params,
            'vnp_SecureHash': hmac.update(qs.stringify(VnpayUtils.sortObject(params), { encode: false })).digest("hex")
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            const depositeTransactionEntity = plainToInstance(DepositeTransaction, {
                orderId,
                bankCode: createPaymentUrlDto.bankCode,
                amount: String(createPaymentUrlDto.amount * 100),
                orderInfo,
                status: DepositeTransactionStatus.INITIALIZE,
                createdAt: date,
                readerId: req.user.userId
            } as DepositeTransaction);
            await queryRunner.manager.save(depositeTransactionEntity);
            await this.redisClient.setEx(KeyGenerator.paymentStatusKey(orderId), 20 * 60, PaymentStatus.PENDING);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }
        return `${this.configService.getVnpConfig().vnpUrl}?${qs.stringify(vnpParams, { encode: false })}`;
    }

    async handleVnpIpn(handleVnpayIpnDto: HandleVnpayIpnDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            const vnpParams = handleVnpayIpnDto;
            const vnpSecureHash = vnpParams.vnp_SecureHash;
            delete vnpParams['vnp_SecureHash'];
            delete vnpParams['vnp_SecureHashType'];
            const hmac = crypto.createHmac("sha512", this.configService.getVnpConfig().vnpHashSecret);
            let signed = hmac.update(qs.stringify(VnpayUtils.sortObject(vnpParams), { encode: false })).digest("hex");

            const depositeTransaction = await this.depositeTransactionRepository.findOne({
                where: {
                    orderId: vnpParams.vnp_TxnRef
                }
            })

            if (vnpSecureHash === signed) {
                if (depositeTransaction) {
                    if (Number(depositeTransaction.amount) == Number(vnpParams.vnp_Amount)) {
                        if (depositeTransaction.status == DepositeTransactionStatus.INITIALIZE) {
                            if (vnpParams.vnp_ResponseCode == "00") {
                                await queryRunner.connect();
                                try {
                                    await queryRunner.startTransaction();
                                    await queryRunner.manager.update(DepositeTransaction, depositeTransaction.id, {
                                        transactionNo: handleVnpayIpnDto.vnp_TransactionNo,
                                        bankTransNo: handleVnpayIpnDto.vnp_BankTranNo,
                                        cardType: handleVnpayIpnDto.vnp_CardType,
                                        payDate: handleVnpayIpnDto.vnp_PayDate,
                                        status: DepositeTransactionStatus.SUCCEED
                                    });
                                    const wallet = await this.walletService.findWalletBy(depositeTransaction.readerId);
                                    await queryRunner.manager.update(Wallet, wallet.id, {
                                        balance: String(Number(wallet.balance) + (Number(depositeTransaction.amount) / 100))
                                    });
                                    await this.redisClient.set(KeyGenerator.paymentStatusKey(depositeTransaction.orderId), PaymentStatus.SUCCEED, { KEEPTTL: true });
                                    await queryRunner.commitTransaction();
                                    return {
                                        RspCode: '00',
                                        Message: 'Success'
                                    }
                                } catch (error) {
                                    await queryRunner.rollbackTransaction();
                                    return error;
                                } finally {
                                    await queryRunner.release();
                                }
                            }
                            else {
                                await this.depositeTransactionRepository.update(depositeTransaction.id, {
                                    transactionNo: handleVnpayIpnDto.vnp_TransactionNo,
                                    bankTransNo: handleVnpayIpnDto.vnp_BankTranNo,
                                    cardType: handleVnpayIpnDto.vnp_CardType,
                                    payDate: handleVnpayIpnDto.vnp_PayDate,
                                    status: DepositeTransactionStatus.FAILED
                                });
                                await this.redisClient.set(KeyGenerator.paymentStatusKey(depositeTransaction.orderId), PaymentStatus.FAILED, { KEEPTTL: true });
                                return {
                                    RspCode: '00',
                                    Message: 'Success'
                                }
                            }
                        }
                        else {
                            return {
                                RspCode: '02',
                                Message: 'This order has been updated to the payment status'
                            }
                        }
                    }
                    else {
                        return {
                            RspCode: '04',
                            Message: 'Amount invalid'
                        }
                    }
                }
                else {
                    return {
                        RspCode: '01',
                        Message: 'Order not found'
                    }
                }
            }
            else {
                return {
                    RspCode: '97',
                    Message: 'Checksum failed'
                }
            }
        } catch (error) {
            return error;
        }
    };

    handleVnpReturn() {
        return FileLoaderUtils.loadHtmlFile('waiting-auth.html');
    };

    async getPaymentStatus(getPaymentStatusDto: GetPaymentStatusDto) {
        const paymentStatus = await this.redisClient.get(KeyGenerator.paymentStatusKey(getPaymentStatusDto.orderId));
        return paymentStatus;
    }
}