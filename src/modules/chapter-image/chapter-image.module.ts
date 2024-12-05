import { Module } from '@nestjs/common';
import { ChapterImageService } from './chapter-image.service';
import { ChapterImageController } from './chapter-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterImage } from '@/database/entities/ChapterImage';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
	imports: [TypeOrmModule.forFeature([ChapterImage]), FileUploadModule],
  controllers: [ChapterImageController],
  providers: [ChapterImageService],
  exports: [ChapterImageService],
})
export class ChapterImageModule {}
