import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { StoryModule } from '../story/story.module';
import { ChapterImageModule } from '../chapter-image/chapter-image.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [StoryModule, ChapterImageModule, UserModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})

export class FileUploadModule {}
