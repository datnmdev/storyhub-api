import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity";
import { Brackets, DataSource, Repository } from "typeorm";
import { GetInvoiceDto } from "./dto/get-invoice.dto";
import { PriceService } from "../price/price.service";
import { ChapterService } from "../chapter/chapter.service";
import { WalletService } from "../wallet/wallet.service";
import { plainToClass } from "class-transformer";
import { Wallet } from "../wallet/entities/Wallet.entity";
import { NotEnoughMoneyException } from "@/common/exceptions/NotEnoughMoneyException";
import { StoryService } from "../story/story.service";

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly priceService: PriceService,
        @Inject(forwardRef(() => ChapterService))
        private readonly chapterService: ChapterService,
        private readonly walletService: WalletService,
        private readonly dataSource: DataSource,
        private readonly storyService: StoryService
    ) { }

    getInvoice(userId: number, getInvoiceDto: GetInvoiceDto) {
        return this.invoiceRepository
            .createQueryBuilder("invoice")
            .where("invoice.reader_id = :reader_id", {
                reader_id: userId
            })
            .where(new Brackets(qb => {
                if (getInvoiceDto.chapterId) {
                    qb.where("invoice.chapter_id = :chapter_id", {
                        chapter_id: getInvoiceDto.chapterId
                    })
                }
            }))
            .orderBy('invoice.created_at', 'DESC')
            .take(getInvoiceDto.limit)
            .skip((getInvoiceDto.page - 1) * getInvoiceDto.limit)
            .getManyAndCount();
    }

    async createInvoiceBy(readerId: number, chapterId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            const now = new Date();
            const invoice = await this.getInvoiceBy(readerId, chapterId);
            if (!invoice) {
                const chapter = await this.chapterService.getOneBy(chapterId);
                const currentPrice = await this.priceService.getPriceAt(chapter.storyId, now);
                const readerWallet = await this.walletService.findWalletBy(readerId);
                const story = await this.storyService.findOne(chapter.storyId);
                const authorWallet = await this.walletService.findWalletBy(story.authorId);
                if (Number(readerWallet.balance) >= currentPrice) {
                    const invoiceEntity = plainToClass(Invoice, {
                        readerId,
                        chapterId,
                        createdAt: now,
                        totalAmount: String(currentPrice)
                    } as Invoice)
                    await queryRunner.manager.save(invoiceEntity);
                    await queryRunner.manager.update(Wallet, readerId, {
                        balance: String(Number(readerWallet.balance) - currentPrice)
                    });
                    await queryRunner.manager.update(Wallet, story.authorId, {
                        balance: String(Number(authorWallet.balance) + Math.floor(currentPrice * 0.9))
                    })
                    await queryRunner.commitTransaction();
                    return true;
                } else {
                    throw new NotEnoughMoneyException();
                }
            }
            return true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    createInvoice(invoiceEntity: Invoice) {
        return this.invoiceRepository.save(invoiceEntity);
    }

    getInvoiceBy(readerId: number, chapterId: number) {
        return this.invoiceRepository.findOne({
            where: {
                readerId,
                chapterId
            }
        })
    }
}