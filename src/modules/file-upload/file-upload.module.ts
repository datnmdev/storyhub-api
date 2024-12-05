import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { StoryModule } from '../story/story.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [StoryModule, UserModule],
	controllers: [FileUploadController],
	providers: [FileUploadService],
	exports: [FileUploadService],
})
export class FileUploadModule {}
