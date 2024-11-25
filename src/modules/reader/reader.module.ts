import { Module } from '@nestjs/common';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reader } from './entities/reader.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reader
    ])
  ],
  controllers: [
    ReaderController
  ],
  providers: [
    ReaderService
  ],
})
export class ReaderModule {}
