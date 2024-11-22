import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('generate-upload-url-story-user')
  async getUploadUrlStoryUser(
    @Body('fileName') fileName: string,
    @Body('userId') userId: number,
    @Body('storyId') storyId: number,
  ) {
    const uploadUrl =
      await this.fileUploadService.generateFileKeyForStoryAndUser(
        userId,
        storyId,
        fileName,
      );
    return { uploadUrl };
  }

  @Post('generate-upload-url-chapter')
  async getUploadUrlChapter(
    @Body() files: { storyId: number; chapterId: number; fileName: string }[],
  ) {
    const uploadUrls =
      await this.fileUploadService.generateFileKeyForChapter(files);
    return { uploadUrls };
  }

  @Delete()
  async deleteFile(@Body('fileName') fileName: string) {
    await this.fileUploadService.deleteFile(fileName);
    return { message: 'File deleted successfully' };
  }
}
