import { forwardRef, Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { StoryModule } from '../story/story.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/database/entities/User';
import { BullModule } from '@/common/bull/bull.module';

@Module({
	imports: [
		StoryModule, UserModule, TypeOrmModule.forFeature([User]),
		BullModule
	],
	controllers: [FileUploadController],
	providers: [FileUploadService],
	exports: [FileUploadService],
})
export class FileUploadModule {}
