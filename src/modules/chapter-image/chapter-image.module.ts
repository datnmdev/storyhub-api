import { Module } from '@nestjs/common';
import { ChapterImageService } from './chapter-image.service';
import { ChapterImageController } from './chapter-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterImage } from '@/database/entities/ChapterImage';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterImage])],
  controllers: [ChapterImageController],
  providers: [ChapterImageService],
  exports: [ChapterImageService]
})
export class ChapterImageModule {}
