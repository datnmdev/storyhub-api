import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Like, Not, Repository, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from '@/database/entities/Story';
import { Genre } from '@/database/entities/Genre';
import { PaginateStoriesDTO } from '@/pagination/paginated-stories.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';
import { GetStoryWithFilterDto } from './dto/get-story-with-filter.dto';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import UrlResolverUtils from '@/common/utils/url-resolver.util';

@Injectable()
export class StoryService {
	constructor(
		@InjectRepository(Story)
		private readonly storyRepository: Repository<Story>,
		@InjectRepository(Genre)
		private readonly genreRepository: Repository<Genre>,
		private readonly urlCipherService: UrlCipherService
	) { }

	async create(createStoryDto: CreateStoryDto): Promise<Story> {
		const genres = await this.genreRepository.findByIds(
			createStoryDto.genres || [],
		);
		const newStory = this.storyRepository.create({
			...createStoryDto,
			genres,
		});
		return await this.storyRepository.save(newStory);
	}

	async findAll(query: PaginateStoriesDTO): Promise<IPaginatedType<Story>> {
		const take = query.take || 10;
		const page = query.page || 1;
		const skip = (page - 1) * take;
		const keyword = query.keyword?.trim() || '';
		const authorId = query.authorId;
		const status = query.status;
		const type = query.type;
		// Điều kiện tìm kiếm
		let whereCondition = {
			...(authorId ? { authorId: authorId } : {}),
			...(keyword ? { title: Like(`%${keyword}%`) } : {}),
			...(type ? { type: type } : {}),
			status: status !== undefined && status !== null ? status : Not(6),
		};

		const [result, totalCount] = await this.storyRepository.findAndCount({
			where: whereCondition,
			order: { createdAt: 'DESC' },
			take: take,
			skip: skip,
			select: [
				'id',
				'title',
				'description',
				'note',
				'coverImage',
				'type',
				'status',
				'createdAt',
				'updatedAt',
			],
			relations: ['aliases', 'country', 'author.user', 'prices', 'genres'],
		});

		// Tính toán các thông tin phân trang
		const totalPages = Math.ceil(totalCount / take);
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		const startCursor = result.length > 0 ? result[0].id.toString() : null;
		const endCursor =
			result.length > 0 ? result[result.length - 1].id.toString() : null;

		const edges = result.map((story) => ({
			cursor: story.id,
			node: story,
		}));
		// Trả về định dạng IPaginatedType<Story>
		return {
			edges,
			totalCount,
			hasNextPage,
			hasPreviousPage,
			startCursor,
			endCursor,
		};
	}

	async findOne(id: number): Promise<Story> {
		const story = await this.storyRepository.findOne({
			where: { id },
			relations: ['aliases', 'country', 'author.user', 'genres'],
		});
		if (!story) {
			throw new Error(`Story with ID ${id} not found`);
		}
		return story;
	}

	async update(updateStoryDto: UpdateStoryDto): Promise<Story> {
		// Tìm Story cần cập nhật
		const story = await this.findOne(updateStoryDto.id);

		Object.assign(story, updateStoryDto);
		await this.storyRepository.save(story);

		return await this.findOne(updateStoryDto.id);
	}

	// Hàm xóa story
	async remove(id: number): Promise<string> {
		// Tìm story theo ID
		const story = await this.findOne(id);

		// Cập nhật trạng thái story
		await this.storyRepository.update({ id: id }, { status: 6 });

		return `This action removes a #${id} story`;
	}

	// datnmptit
	async getStoryWithFilter(getStoryWithFilterDto: GetStoryWithFilterDto) {
		const qb = this.storyRepository
			.createQueryBuilder("story")
			.where(new Brackets(qb => {
				if (getStoryWithFilterDto.id) {
					qb.where("story.id = :id", {
						id: getStoryWithFilterDto.id
					})
				}
			}))
			.andWhere(new Brackets(qb => {
				if (getStoryWithFilterDto.title) {
					qb.where("story.title = :title", {
						title: getStoryWithFilterDto.title
					})
				}
			}))
			.andWhere(new Brackets(qb => {
				if (getStoryWithFilterDto.type) {
					getStoryWithFilterDto.type.forEach((type, index) => {
						qb.orWhere(`story.type = :type${index}`, {
							[`type${index}`]: type
						})
					})
				}
			}))
			.andWhere(new Brackets(qb => {
				if (getStoryWithFilterDto.status) {
					getStoryWithFilterDto.status.forEach((status, index) => {
						qb.orWhere(`story.status = :status${index}`, {
							[`status${index}`]: status
						})
					})
				}
			}))
			.andWhere(new Brackets(qb => {
				if (getStoryWithFilterDto.countryId) {
					qb.where("story.country_id = :country_id", {
						country_id: getStoryWithFilterDto.countryId
					})
				}
			}))
			.andWhere(new Brackets(qb => {
				if (getStoryWithFilterDto.authorId) {
					qb.where("story.author_id = :author_id", {
						author_id: getStoryWithFilterDto.authorId
					})
				}
			}));

		if (getStoryWithFilterDto.orderBy) {
			getStoryWithFilterDto.orderBy.forEach(value => {
				qb.addOrderBy(`story.${value[0]}`, value[1]);
			})
		}
		qb.take(getStoryWithFilterDto.limit)
		qb.skip((getStoryWithFilterDto.page - 1) * getStoryWithFilterDto.limit);

		const stories = await qb.getManyAndCount();
		return [
			stories[0].map(story => {
				const payload: UrlCipherPayload = {
					url: story.coverImage,
					expireIn: 4 * 60 * 60,
					iat: Date.now()
				}
				const encryptedUrl = this.urlCipherService.generate(payload);
				return {
					...story,
					coverImage: UrlResolverUtils.createUrl('/url-resolver', encryptedUrl)
				}
			}),
			stories[1]
		]
	}

	async getGenres(storyId: number) {
		const story = await this.storyRepository.findOne({
			where: {
				id: storyId
			},
			relations: [
				'genres'
			]
		})

		return story.genres;
	}
}
