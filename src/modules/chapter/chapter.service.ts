import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from '@/database/entities/Chapter';
import { DataSource, Like, Not, Repository } from 'typeorm';
import { PaginatedChaptersDTO } from '@/pagination/paginated-chapters.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';
import { Brackets } from 'typeorm';
import {
	ChapterInfoPublicDto,
	GetChapterWithFilterDto,
} from './dto/get-chapter-with-filter.dto';
import { ChapterStatus } from '@/common/constants/chapter.constants';
import { plainToInstance } from 'class-transformer';
import { PriceService } from '../price/price.service';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Wallet } from '../wallet/entities/Wallet.entity';
import { WalletService } from '../wallet/wallet.service';
import { NotEnoughMoneyException } from '@/common/exceptions/NotEnoughMoneyException';
import { InvoiceService } from '../invoice/invoice.service';
import { StoryType } from '@/common/constants/story.constants';
import { ImageContentDto, TextContentDto } from './dto/get-chapter-content';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { UrlCipherPayload } from '@/common/url-cipher/url-cipher.class';
import { User } from '@/@types/express';
import { Role } from '@/common/constants/account.constants';

@Injectable()
export class ChapterService {
	constructor(
		@InjectRepository(Chapter)
		private chapterRepository: Repository<Chapter>,
		private readonly priceService: PriceService,
		private readonly dataSource: DataSource,
		private readonly walletService: WalletService,
		private readonly invoiceService: InvoiceService,
		private readonly urlCipherService: UrlCipherService,
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
			relations: ['chapterImages'],
		});

		// Tính toán các thông tin phân trang
		const totalPages = Math.ceil(totalCount / take);
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		const startCursor = result.length > 0 ? result[0].id.toString() : null;
		const endCursor =
			result.length > 0 ? result[result.length - 1].id.toString() : null;

		const edges = result.map((chapter) => {
			const chapterImages = chapter.chapterImages;
			const payload: UrlCipherPayload[] = chapterImages.map((image) => ({
				url: image.path,
				expireIn: 4 * 60 * 60, // Thời gian hết hạn là 4 giờ (tính bằng giây)
				iat: Date.now(), // Thời điểm hiện tại (thời gian tạo)
			}));
			const encryptedUrls = payload.map((p) =>
				this.urlCipherService.generate(p),
			); // Mã hóa URL bằng dịch vụ urlCipherService
			return {
				cursor: chapter.id,
				node: {
					...chapter, // Sao chép tất cả các thuộc tính của đối tượng chapter
					chapterImages: chapterImages.map((image, index) => ({
						...image,
						path: UrlResolverUtils.createUrl(
							'/url-resolver',
							encryptedUrls[index],
						), // Thay thế path bằng URL đã mã hóa
					})),
				},
			};
		});
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

	// datnmptit
	async getChapterWithFilter(
		getChapterWithFilterDto: GetChapterWithFilterDto,
	) {
		const qb = this.chapterRepository
			.createQueryBuilder('chapter')
			.where(
				new Brackets((qb) => {
					if (getChapterWithFilterDto.id) {
						qb.where('chapter.id = :id', {
							id: getChapterWithFilterDto.id,
						});
					}
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					if (getChapterWithFilterDto.order) {
						qb.where('chapter.order = :order', {
							order: getChapterWithFilterDto.order,
						});
					}
				}),
			)
			.andWhere(
				new Brackets((qb) => {
					if (getChapterWithFilterDto.name) {
						qb.where('chapter.name = :name', {
							name: getChapterWithFilterDto.name,
						});
					}
				}),
			)
			.andWhere('chapter.status = :status', {
				status: ChapterStatus.PUBLISHING,
			})
			.andWhere(
				new Brackets((qb) => {
					if (getChapterWithFilterDto.storyId) {
						qb.where('chapter.story_id = :storyId', {
							storyId: getChapterWithFilterDto.storyId,
						});
					}
				}),
			);

		if (getChapterWithFilterDto.orderBy) {
			getChapterWithFilterDto.orderBy.forEach((value) => {
				qb.addOrderBy(`chapter.${value[0]}`, value[1]);
			});
		}
		qb.take(getChapterWithFilterDto.limit);
		qb.skip(
			(getChapterWithFilterDto.page - 1) * getChapterWithFilterDto.limit,
		);
		const chapters = await qb.getManyAndCount();
		return [
			plainToInstance(ChapterInfoPublicDto, chapters[0]),
			chapters[1],
		];
	}

	async getChapterContent(user: User, chapterId: number) {
		const now = new Date();
		const chapter = await this.chapterRepository.findOne({
			where: {
				id: chapterId,
			},
			relations: ['story', 'chapterImages'],
		});

		if (chapter) {
			const currentPrice = await this.priceService.getPriceAt(
				chapter.storyId,
				now,
			);
			if (currentPrice > 0) {
				if (user.role === Role.READER) {
					const isPaid = await this.invoiceService.getInvoiceBy(
						user.userId,
						chapterId,
					);
					// Kiểm tra thanh toán hay chưa?
					if (!isPaid) {
						throw new NotEnoughMoneyException();
					}
				} else {
					throw new NotEnoughMoneyException();
				}
			}

			// Kiểm tra loại truyện và trả về nội dung chương
			if (chapter.story.type === StoryType.COMIC) {
				return plainToInstance(ImageContentDto, {
					...chapter,
					images: chapter.chapterImages.map((chapterImage) => ({
						...chapterImage,
						path: UrlResolverUtils.createUrl(
							'/url-resolver',
							this.urlCipherService.generate(
								plainToInstance(UrlCipherPayload, {
									url: chapterImage.path,
									expireIn: 4 * 60 * 60,
									iat: Date.now(),
								} as UrlCipherPayload),
							),
						),
					})),
				} as ImageContentDto);
			} else {
				return plainToInstance(TextContentDto, chapter);
			}
		} else {
			throw new NotFoundException();
		}
	}

	getOneBy(id: number) {
		return this.chapterRepository.findOne({
			where: {
				id,
			},
		});
	}
}
