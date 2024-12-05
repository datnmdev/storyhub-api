import { Injectable } from '@nestjs/common';
import { CreateChapterImageDto } from './dto/create-chapter-image.dto';
import { UpdateChapterImageDto } from './dto/update-chapter-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterImage } from '@/database/entities/ChapterImage';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { DeleteChapterImageDto } from './dto/delete-chapter-image.dto';

@Injectable()
export class ChapterImageService {
	constructor(
		@InjectRepository(ChapterImage)
		private readonly chapterImageRepository: Repository<ChapterImage>,
		private readonly fileUploadService: FileUploadService,
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
		return images.length > 0 ? images : [];
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
	): Promise<ChapterImage> {
		return await this.chapterImageRepository.save(updateChapterImageDto);
	}

	async remove(chapterImage: DeleteChapterImageDto): Promise<string> {
		await this.chapterImageRepository.delete(chapterImage.id);
		await this.fileUploadService.deleteFile(chapterImage.fileName);
		return `Removed chapter image`;
	}
}
