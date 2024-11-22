import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StoryService } from '../story/story.service';
import { UserService } from '../user/user.service';
import { ChapterImageService } from '../chapter-image/chapter-image.service';

@Injectable()
export class FileUploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.S3_BUCKET_NAME;

  constructor(
    private readonly storyService: StoryService,
    private readonly chapterImageService: ChapterImageService,
    private readonly userService: UserService,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  // Generate upload url from frontend to s3
  async generateUploadUrl(fileKey: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      ACL: 'public-read' as ObjectCannedACL,
    };
    const command = new PutObjectCommand(params);
    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error(`Error generating upload URL: ${error.message}`);
      throw new Error(`Error generating upload URL: ${error.message}`);
    }
  }

  // Generate fileKey for story and user
  async generateFileKeyForStoryAndUser(
    userId: number,
    storyId: number,
    fileName: string,
  ): Promise<string> {
    let fileKeyPrefix = '';
    let serviceToCall = null;
    let updateField = '';

    if (userId != null && userId != undefined) {
      fileKeyPrefix = `user/${String(userId)}/`;
      serviceToCall = this.userService;
      updateField = 'avatar';
    } else if (storyId != null && storyId != undefined) {
      fileKeyPrefix = `story/${String(storyId)}/`;
      serviceToCall = this.storyService;
      updateField = 'coverImage';
    } else {
      throw new Error('Both userId and storyId cannot be null or undefined');
    }

    await this.checkFolderExistsSequential(fileKeyPrefix);
    // Tạo fileKey từ prefix và fileName
    const fileKey = `${fileKeyPrefix}${fileName}`;

    // Gọi phương thức generateUploadUrl với fileKey
    const uploadUrl = await this.generateUploadUrl(fileKey);

    const entity =
      (await serviceToCall.getProfile(userId)) ||
      (await serviceToCall.findOne(storyId));
    if (entity && entity[updateField]) {
      await this.deleteFile(entity[updateField]);
      await serviceToCall.update({ [updateField]: fileKey });
    }
    return uploadUrl;
  }

  // Generate fileKey for chapter
  async generateFileKeyForChapter(
    files: { storyId: number; chapterId: number; fileName: string }[],
  ): Promise<string[]> {
    const uploadUrls: string[] = [];

    for (const { storyId, chapterId, fileName } of files) {
      let storyIdStr = String(storyId);
      let chapterIdStr = String(chapterId);
      try {
        await this.checkFolderExistsSequential(
          `story/${storyIdStr}/chapter/${chapterIdStr}/`,
        );
        // Tạo fileKey từ storyId, chapterId và fileName
        const fileKey = `story/${storyIdStr}/chapter/${chapterIdStr}/${fileName}`;

        // Gọi phương thức generateUploadUrlStory với fileKey
        const uploadUrl = await this.generateUploadUrl(fileKey);
        uploadUrls.push(uploadUrl);
      } catch (error) {
        console.error(
          `Error generating file key for chapter: ${error.message}`,
        );
        throw new Error(
          `Error generating file key for chapter: ${error.message}`,
        );
      }
    }

    return uploadUrls;
  }

  // Delete a file from S3
  async deleteFile(fileKey: string) {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
    };
    try {
      // Check if the file exists before deleting
      const headCommand = new HeadObjectCommand(params);
      try {
        await this.s3Client.send(headCommand);
      } catch (error) {
        if (error.name === 'NotFound') {
          throw new Error(`File ${fileKey} does not exist in S3`);
        }
        throw error;
      }
      // If the file exists, proceed with deletion
      const deleteCommand = new DeleteObjectCommand(params);
      await this.s3Client.send(deleteCommand);
      console.log(`File ${fileKey} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Error deleting file from S3: ${error.message}`);
    }
  }
  private async checkFolderExistsSequential(path: string) {
    const folders = path.split('/').filter(Boolean); // Tách đường dẫn thành các cấp thư mục
    let currentPath = '';

    for (const folder of folders) {
      currentPath += `${folder}/`;

      // Kiểm tra xem thư mục hiện tại có tồn tại không
      const exists = await this.checkSingleFolderExists(currentPath);
      if (!exists) {
        // Nếu thư mục không tồn tại, tạo thư mục
        await this.createFolder(currentPath);
        console.log(`Folder ${currentPath} created.`);
      }
    }
  }

  private async checkSingleFolderExists(folderPath: string): Promise<boolean> {
    const headParams = {
      Bucket: this.bucketName,
      Key: folderPath,
    };
    const headCommand = new HeadObjectCommand(headParams);

    try {
      await this.s3Client.send(headCommand);
      return true; // Thư mục tồn tại
    } catch (error) {
      if (error.name === 'NotFound') {
        return false; // Thư mục không tồn tại
      } else {
        throw error; // Lỗi khác
      }
    }
  }

  private async createFolder(folderPath: string) {
    const putParams = {
      Bucket: this.bucketName,
      Key: folderPath,
      Body: '',
    };
    const putCommand = new PutObjectCommand(putParams);
    await this.s3Client.send(putCommand);
  }
}
