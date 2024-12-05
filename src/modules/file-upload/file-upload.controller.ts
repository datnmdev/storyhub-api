import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
	constructor(private readonly fileUploadService: FileUploadService) {}

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
}
