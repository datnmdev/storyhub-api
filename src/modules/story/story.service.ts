import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Like, Not, Repository, Brackets, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from '@/database/entities/Story';
import { Genre } from '@/database/entities/Genre';
import { PaginateStoriesDTO } from '@/pagination/paginated-stories.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';
import { GetStoryWithFilterDto } from './dto/get-story-with-filter.dto';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { StoryStatus } from '@/common/constants/story.constants';
import { plainToInstance } from 'class-transformer';
import { View } from '../view/entities/view.entity';

@Injectable()
export class StoryService {
	constructor(
		@InjectRepository(Story)
		private readonly storyRepository: Repository<Story>,
		@InjectRepository(Genre)
		private readonly genreRepository: Repository<Genre>,
		private readonly urlCipherService: UrlCipherService,
		private readonly dataSource: DataSource
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
			relations: [
				'aliases',
				'country',
				'author.user',
				'prices',
				'genres',
				'moderationRequests',
			],
		});

		// Tính toán các thông tin phân trang
		const totalPages = Math.ceil(totalCount / take);
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		const startCursor = result.length > 0 ? result[0].id.toString() : null;
		const endCursor =
			result.length > 0 ? result[result.length - 1].id.toString() : null;

		const edges = result.map((story) => {
			const payload: UrlCipherPayload = {
				url: story.coverImage,
				expireIn: 4 * 60 * 60, // Thời gian hết hạn là 4 giờ (tính bằng giây)
				iat: Date.now(), // Thời điểm hiện tại (thời gian tạo)
			};
			const encryptedUrl = this.urlCipherService.generate(payload); // Mã hóa URL bằng dịch vụ urlCipherService
			return {
				cursor: story.id,
				node: {
					...story, // Sao chép tất cả các thuộc tính của đối tượng story
					coverImage: UrlResolverUtils.createUrl(
						'/url-resolver',
						encryptedUrl,
					), // Thay thế coverImage bằng URL đã mã hóa
				},
			};
		});
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
			relations: [
				'aliases',
				'country',
				'author.user',
				'genres',
				'prices',
				'followDetails',
				'ratingDetails',
				'comments',
				'chapters.views',
			],
		});
		if (!story) {
			throw new Error(`Story with ID ${id} not found`);
		}
		return {
			...story,
			coverImage: story.coverImage
				? UrlResolverUtils.createUrl(
						'/url-resolver',
						this.urlCipherService.generate({
							url: story.coverImage,
							expireIn: 30 * 60 * 60,
							iat: Date.now(),
						}),
					)
				: story.coverImage,
		};
	}

	async update(updateStoryDto: UpdateStoryDto): Promise<Story> {
		// chưa làm dc cập nhật genres
		// if (updateStoryDto.genres) {
		// 	const genres = updateStoryDto.genres.split(',').map(genre => ({
		// 		name: genre.trim(),
		// 		storyId: story.id,
		// 	}));
		// 	await this.genreRepository.save(genres);
		// }

		const { genres, ...updateData } = updateStoryDto;
		await this.storyRepository.update(updateStoryDto.id, updateData);

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
		if (getStoryWithFilterDto.genres) {
			const qb = this.storyRepository
				.createQueryBuilder("story")
				.innerJoin("story.genres", 'genre', getStoryWithFilterDto.genres.map(genreId => `genre.id = ${genreId}`).join(' OR '))
				.groupBy("story.id")
				.select([
					"story.*",
				])
				.addSelect("COUNT(*)", "genreCount")
				.having("genreCount = :genreCount", {
					genreCount: getStoryWithFilterDto.genres.length,
				})
				.andWhere(new Brackets(qb => {
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
			qb.limit(getStoryWithFilterDto.limit)
			qb.offset((getStoryWithFilterDto.page - 1) * getStoryWithFilterDto.limit);
			const stories = await qb.getRawMany();
			return [
				stories.map(story => {
					return {
						id: story.id,
						title: story.title,
						description: story.description,
						note: story.note,
						coverImage: UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
							url: story.cover_image,
							expireIn: 4 * 60 * 60,
							iat: Date.now()
						} as UrlCipherPayload))),
						type: story.type,
						status: story.status,
						createdAt: story.created_at,
						updatedAt: story.updated_at,
						countryId: story.country_id,
						authorId: story.author_id
					}
				}),
				stories.length
			]
		}

		const qb = this.storyRepository
			.createQueryBuilder('story')
			.where(
				new Brackets((qb) => {
					if (getStoryWithFilterDto.id) {
						qb.where('story.id = :id', {
							id: getStoryWithFilterDto.id,
						});
					}
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					if (getStoryWithFilterDto.title) {
						qb.where('story.title = :title', {
							title: getStoryWithFilterDto.title,
						});
					}
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					if (getStoryWithFilterDto.type) {
						getStoryWithFilterDto.type.forEach((type, index) => {
							qb.orWhere(`story.type = :type${index}`, {
								[`type${index}`]: type,
							});
						});
					}
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					if (getStoryWithFilterDto.status) {
						getStoryWithFilterDto.status.forEach(
							(status, index) => {
								qb.orWhere(`story.status = :status${index}`, {
									[`status${index}`]: status,
								});
							},
						);
					}
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					if (getStoryWithFilterDto.countryId) {
						qb.where('story.country_id = :country_id', {
							country_id: getStoryWithFilterDto.countryId,
						});
					}
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					if (getStoryWithFilterDto.authorId) {
						qb.where('story.author_id = :author_id', {
							author_id: getStoryWithFilterDto.authorId,
						});
					}
				}),
			);

		if (getStoryWithFilterDto.orderBy) {
			getStoryWithFilterDto.orderBy.forEach((value) => {
				qb.addOrderBy(`story.${value[0]}`, value[1]);
			});
		}
		qb.take(getStoryWithFilterDto.limit);
		qb.skip((getStoryWithFilterDto.page - 1) * getStoryWithFilterDto.limit);

		const stories = await qb.getManyAndCount();
		return [
			stories[0].map((story) => {
				const payload: UrlCipherPayload = {
					url: story.coverImage,
					expireIn: 4 * 60 * 60,
					iat: Date.now(),
				};
				const encryptedUrl = this.urlCipherService.generate(payload);
				return {
					...story,
					coverImage: UrlResolverUtils.createUrl(
						'/url-resolver',
						encryptedUrl,
					),
				};
			}),
			stories[1],
		];
	}

	async getGenres(storyId: number) {
		const story = await this.storyRepository.findOne({
			where: {
				id: storyId,
			},
			relations: ['genres'],
		});

		return story.genres;
	}

	async search(keyword: string) {
		const results = await this.storyRepository
			.createQueryBuilder('story')
			.innerJoinAndSelect('story.author', 'author')
			.innerJoinAndSelect('story.country', 'country')
			.innerJoinAndSelect('author.user', 'user')
			.where(
				new Brackets(qb => {
					qb.where(`MATCH (story.title) AGAINST (:title)`, {
						title: keyword
					})
				})
			)
			.andWhere(
				new Brackets(qb => {
					qb.where('story.status = :status1', { status1: StoryStatus.PUBLISHING })
						.orWhere('story.status = :status2', { status2: StoryStatus.FINISHED });
				})
			)
			.getManyAndCount();

		return [
			results[0].map(story => ({
				...story,
				coverImage: UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
					url: story.coverImage,
					expireIn: 4 * 60 * 60,
					iat: Date.now()
				} as UrlCipherPayload)))
			})),
			results[1]
		]
	}

}
