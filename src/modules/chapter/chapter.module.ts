import { forwardRef, Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '@/database/entities/Chapter';
import { PriceModule } from '../price/price.module';
import { WalletModule } from '../wallet/wallet.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter]),
    PriceModule,
    WalletModule,
    InvoiceModule
  ],
  controllers: [
    ChapterController
  ],
  providers: [
    ChapterService
  ],
  exports: [
    ChapterService
  ]
})
export class ChapterModule { }
