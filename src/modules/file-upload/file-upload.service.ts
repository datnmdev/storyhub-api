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
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/database/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
	private readonly s3Client: S3Client;
	private readonly bucketName = process.env.S3_BUCKET_NAME;
	@InjectRepository(User)
	private readonly userRepository: Repository<User>;

	constructor(private readonly storyService: StoryService) {
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
			return await getSignedUrl(this.s3Client, command, {
				expiresIn: 7200,
			});
		} catch (error) {
			console.error(`Error generating upload URL: ${error.message}`);
			throw new Error(`Error generating upload URL: ${error.message}`);
		}
	}

	// Generate fileKey for story
	async generateFileKeyForStory(
		storyId: number,
		fileName: string,
	): Promise<string> {
		await this.checkFolderExistsSequential(`story/${String(storyId)}/`);
		// Tạo fileKey từ prefix và fileName
		const fileKey = `story/${String(storyId)}/${fileName}`;

		// Gọi phương thức generateUploadUrl với fileKey
		const uploadUrl = await this.generateUploadUrl(fileKey);

		const entity = await this.storyService.findOne(storyId);
		if (entity && entity.coverImage) {
			await this.deleteFile(
				entity.coverImage.replace('@internal:aws-s3:', ''),
			);
			await this.storyService.update({
				id: storyId,
				coverImage: `@internal:aws-s3:${fileKey}`,
			});
		}
		return uploadUrl;
	}

	// Generate fileKey for user
	async generateFileKeyForUser(
		userId: number,
		fileName: string,
	): Promise<string> {
		await this.checkFolderExistsSequential(`user/${String(userId)}/`);
		const fileKey = `user/${String(userId)}/${fileName}`;

		// Gọi phương thức generateUploadUrl với fileKey
		const uploadUrl = await this.generateUploadUrl(fileKey);

		const entity = await this.userRepository.findOneBy({ id: userId });
		if (entity && entity.avatar) {
			await this.deleteFile(
				entity.avatar.replace('@internal:aws-s3:', ''),
			);
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
	async deleteFile(fileName: string): Promise<string> {
		const params = {
			Bucket: this.bucketName,
			Key: fileName,
		};

		try {
			// Kiểm tra xem file có tồn tại không
			const headCommand = new HeadObjectCommand(params);
			await this.s3Client.send(headCommand);

			// Nếu file tồn tại, tiến hành xóa
			const deleteCommand = new DeleteObjectCommand(params);
			await this.s3Client.send(deleteCommand);
			return `File ${fileName} deleted successfully.`;
		} catch (error) {
			if (error.name === 'NotFound') {
				return `File ${fileName} does not exist in S3.`;
			}
			throw new Error(
				`Error checking or deleting file: ${error.message}`,
			);
		}
	}

	private async checkFolderExistsSequential(path: string): Promise<void> {
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

	private async checkSingleFolderExists(
		folderPath: string,
	): Promise<boolean> {
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

	private async createFolder(folderPath: string): Promise<void> {
		const putParams = {
			Bucket: this.bucketName,
			Key: folderPath,
			Body: '',
		};
		const putCommand = new PutObjectCommand(putParams);
		await this.s3Client.send(putCommand);
	}

	// datnmptit
	getAwsS3Client() {
		return this.s3Client;
	}

	generatePreUploadUrl(fileKey: string, fileType: string) {
		const params = {
			Bucket: this.bucketName,
			Key: fileKey,
			ACL: 'public-read' as ObjectCannedACL,
			ContentType: fileType
		};
		const command = new PutObjectCommand(params);
		return getSignedUrl(this.s3Client, command, {
			expiresIn: 7200
		});
	}
}
