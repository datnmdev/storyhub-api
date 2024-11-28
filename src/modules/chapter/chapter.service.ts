import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from '@/database/entities/Chapter';
import { Like, Not, Repository } from 'typeorm';
import { PaginatedChaptersDTO } from '@/pagination/paginated-chapters.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';

@Injectable()
export class ChapterService {
	constructor(
		@InjectRepository(Chapter)
		private chapterRepository: Repository<Chapter>,
	) {}
	async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
		return this.chapterRepository.save(createChapterDto);
	}

	async findAll(
		paginationDto: PaginatedChaptersDTO,
	): Promise<IPaginatedType<Chapter>> {
		const take = paginationDto.take || 10;
		const page = paginationDto.page || 1;
		const skip = (page - 1) * take;
		const keyword = paginationDto.keyword?.trim() || '';
		const storyId = paginationDto.storyId;
		const status = paginationDto.status;
		const type = paginationDto.type;
		// Điều kiện tìm kiếm
		let whereCondition = {
			...(storyId ? { storyId: storyId } : {}),
			...(keyword ? { name: Like(`%${keyword}%`) } : {}),
			...(type ? { type: type } : {}),
			status: status !== undefined && status !== null ? status : Not(6),
		};

		const [result, totalCount] = await this.chapterRepository.findAndCount({
			where: whereCondition,
			order: { order: 'DESC' },
			take: take,
			skip: skip,
			select: [
				'id',
				'order',
				'name',
				'content',
				'status',
				'createdAt',
				'updatedAt',
			],
			relations: ['chapterImages'],
		});

		// Tính toán các thông tin phân trang
		const totalPages = Math.ceil(totalCount / take);
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		const startCursor = result.length > 0 ? result[0].id.toString() : null;
		const endCursor =
			result.length > 0 ? result[result.length - 1].id.toString() : null;

		const edges = result.map((chapter) => ({
			cursor: chapter.id,
			node: chapter,
		}));
		return {
			edges,
			totalCount,
			hasNextPage,
			hasPreviousPage,
			startCursor,
			endCursor,
		};
	}

	async findOne(id: number): Promise<Chapter> {
		const chapter = await this.chapterRepository.findOne({
			where: { id },
			relations: ['chapterImages'],
		});
		if (!chapter) {
			throw new Error(`Chapter with ID ${id} not found`);
		}
		return chapter;
	}

	async update(updateChapterDto: UpdateChapterDto): Promise<Chapter> {
		const chapter = await this.findOne(updateChapterDto.id);
		Object.assign(chapter, updateChapterDto);
		await this.chapterRepository.save(chapter);
		return await this.findOne(updateChapterDto.id);
	}

	async remove(id: number): Promise<string> {
		// Tìm chapter theo ID
		const chapter = await this.findOne(id);

		// Cập nhật trạng thái chapter
		await this.chapterRepository.update({ id: id }, { status: 6 });
		return `This action removes a #${id} chapter`;
	}
}
