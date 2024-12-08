import { Controller, Post, Body, Delete, UseGuards, Query, Get} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { User } from '@/common/decorators/user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/account.constants';
import { RolesGuard } from '@/common/guards/roles.guard';
import UploadUtils from '@/common/utils/upload.util';
import { GetPreUploadUrlDto } from './dto/get-pre-upload-url.dto';
import { BullService } from '@/common/bull/bull.service';

@Controller('file-upload')
export class FileUploadController {
	constructor(
		private readonly fileUploadService: FileUploadService,
		private readonly bullService: BullService
	) {}

	@Post('generate-upload-url-story')
	async getUploadUrlStory(
		@Body() body: { fileName: string; storyId: number },
	): Promise<string> {
		const uploadUrl = await this.fileUploadService.generateFileKeyForStory(
			body.storyId,
			body.fileName,
		);
		return uploadUrl;
	}

	@Post('generate-upload-url-user')
	async getUploadUrlUser(
		@Body() body: { fileName: string; userId: number },
	): Promise<string> {
		const uploadUrl = await this.fileUploadService.generateFileKeyForUser(
			body.userId,
			body.fileName,
		);
		return uploadUrl;
	}

	@Post('generate-upload-url-chapter')
	async getUploadUrlChapter(
		@Body()
		files: { storyId: number; chapterId: number; fileName: string }[],
	) {
		const uploadUrls =
			await this.fileUploadService.generateFileKeyForChapter(files);
		return { uploadUrls };
	}

	@Delete()
	async deleteFile(@Body('fileName') fileName: string) {
		const message = await this.fileUploadService.deleteFile(fileName);
		return { message };
	}

	// datnmptit
	@Get('get-pre-upload-avatar-url')
	@Roles(Role.READER, Role.MANAGER, Role.AUTHOR)
	@UseGuards(RolesGuard)
	async getPreUploadAvatarUrl(@User('userId') userId: number, @Query() getPreUploadUrlDto: GetPreUploadUrlDto) {
		const fileKey = UploadUtils.generateUploadAvatarFileKey(userId, getPreUploadUrlDto.fileType);
		await this.bullService.addDeleteFileAwsS3Job({
			userId,
			fileKey,
			delay: 7200
		});
		return {
			preUploadUrl: await this.fileUploadService.generatePreUploadUrl(fileKey, getPreUploadUrlDto.fileType),
			fileKey
		};
	}
}
