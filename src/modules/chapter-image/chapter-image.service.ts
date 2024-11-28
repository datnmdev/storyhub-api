import { Injectable } from '@nestjs/common';
import { CreateChapterImageDto } from './dto/create-chapter-image.dto';
import { UpdateChapterImageDto } from './dto/update-chapter-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterImage } from '@/database/entities/ChapterImage';
import { Repository } from 'typeorm';

@Injectable()
export class ChapterImageService {
	constructor(
		@InjectRepository(ChapterImage)
		private readonly chapterImageRepository: Repository<ChapterImage>,
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
		updateChapterImageDto: UpdateChapterImageDto[],
	): Promise<ChapterImage[]> {
		return await this.chapterImageRepository.save(updateChapterImageDto);
	}

	async remove(id: number): Promise<string> {
		await this.chapterImageRepository.delete(id);
		return `This action removes a #${id} chapterImage`;
	}
}
