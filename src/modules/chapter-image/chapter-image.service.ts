import { Injectable } from '@nestjs/common';
import { CreateChapterImageDto } from './dto/create-chapter-image.dto';
import { UpdateChapterImageDto } from './dto/update-chapter-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterImage } from '@/database/entities/ChapterImage';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
@Injectable()
export class ChapterImageService {
	constructor(
		@InjectRepository(ChapterImage)
		private readonly chapterImageRepository: Repository<ChapterImage>,
		private readonly fileUploadService: FileUploadService,
		private readonly urlCipherService: UrlCipherService,
	) {}

	async create(
		createChapterImageDto: CreateChapterImageDto[],
	): Promise<ChapterImage[]> {
		return await this.chapterImageRepository.save(createChapterImageDto);
	}

	async findAll(chapterId: string): Promise<ChapterImage[]> {
		const images = await this.chapterImageRepository.find({
			where: { chapterId: +chapterId },
			order: {
				order: 'ASC',
			},
		});
		return images.map((image) => {
			const payload: UrlCipherPayload = {
				url: image.path,
				expireIn: 4 * 60 * 60, // Thời gian hết hạn là 4 giờ (tính bằng giây)
				iat: Date.now(), // Thời điểm hiện tại (thời gian tạo)
			};
			const encryptedUrl = this.urlCipherService.generate(payload); // Mã hóa URL bằng dịch vụ urlCipherService
			return {
				...image, // Sao chép tất cả các thuộc tính của đối tượng image
				path: UrlResolverUtils.createUrl('/url-resolver', encryptedUrl), // Thay thế path bằng URL đã mã hóa
			};
		});
	}

	async findOne(id: number): Promise<ChapterImage> {
		const chapterImage = await this.chapterImageRepository.findOne({
			where: { id },
		});
		if (!chapterImage) {
			throw new Error(`ChapterImage with ID ${id} not found`);
		}
		return chapterImage;
	}

	async update(
		updateChapterImageDto: UpdateChapterImageDto,
	): Promise<string> {
		const updatedImage = await this.chapterImageRepository.update(
			updateChapterImageDto.id,
			updateChapterImageDto,
		);
		return 'Cập nhật hình ảnh chương thành công';
	}

	async remove(id: number): Promise<string> {
		const chapterImage = await this.findOne(id);
		if (chapterImage.path.startsWith('@internal:aws-s3:')) {
			await this.fileUploadService.deleteFile(
				chapterImage.path.replace('@internal:aws-s3:', ''),
			);
		}
		await this.chapterImageRepository.delete(id);
		return `This action removes a #${id} chapter image`;
	}
}
