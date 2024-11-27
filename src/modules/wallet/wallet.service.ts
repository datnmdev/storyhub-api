import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "./entities/Wallet.entity";
import { Repository } from "typeorm";

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>
    ) {}

    findWalletBy(userId: number) {
        return this.walletRepository.findOne({
            where: {
                id: userId
            }
        })
    }
}