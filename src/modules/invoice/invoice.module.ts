import { forwardRef, Module } from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { InvoiceController } from "./invoice.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity";
import { PriceModule } from "../price/price.module";
import { ChapterModule } from "../chapter/chapter.module";
import { WalletModule } from "../wallet/wallet.module";
import { StoryService } from "../story/story.service";
import { StoryModule } from "../story/story.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Invoice
        ]),
        PriceModule,
        forwardRef(() => ChapterModule),
        WalletModule,
        StoryModule
    ],
    controllers: [
        InvoiceController
    ],
    providers: [
        InvoiceService
    ],
    exports: [
        InvoiceService
    ]
})
export class InvoiceModule {}