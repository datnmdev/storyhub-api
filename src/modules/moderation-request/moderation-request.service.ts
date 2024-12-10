import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModerationRequestDto } from './dto/create-moderation-request.dto';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { PaginateModerationReqDTO } from '@/pagination/paginated-moderation-req.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';

@Injectable()
export class ModerationRequestService {
	constructor(
		@InjectRepository(ModerationRequest)
		private readonly moderationReqRepository: Repository<ModerationRequest>,
		private readonly urlCipherService: UrlCipherService,
	) {}
	async createModorationReq(
		createModerationRequestDto: CreateModerationRequestDto,
	): Promise<ModerationRequest> {
		return await this.moderationReqRepository.save(
			createModerationRequestDto,
		);
	}

	async findAll(
		query: PaginateModerationReqDTO,
	): Promise<IPaginatedType<ModerationRequest>> {
		const take = query.take || 10;
		const page = query.page || 1;
		const skip = (page - 1) * take;
		const keyword = query.keyword?.trim() || '';
		const type = query.type;
		// Điều kiện tìm kiếm
		let whereCondition = {
			...(type ? { type: type } : {}),
			status: 0,
		};

		const [result, totalCount] =
			await this.moderationReqRepository.findAndCount({
				where: whereCondition,
				order: { createdAt: 'DESC' },
				//take: take,
				//skip: skip,
				select: [
					'id',
					'reason',
					'status',
					'type',
					'status',
					'createdAt',
					'requesterId',
					'responserId',
					'storyId',
				],
				relations: [
					'story',
					'story.aliases',
					'story.country',
					'story.prices',
					'story.genres',
					'story.author.user',
				],
			});
		let filteredResult = result.filter((item) => item.storyId !== null);
		if (keyword) {
			filteredResult = filteredResult.filter((item) =>
				item.story?.author?.user?.name.includes(keyword),
			);
		}
		// Tính toán các thông tin phân trang
		const totalPages = Math.ceil(filteredResult.length / take);
		const resultPagination = filteredResult.slice(
			(page - 1) * take,
			page * take,
		);
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		const startCursor =
			resultPagination.length > 0
				? resultPagination[0].id.toString()
				: null;
		const endCursor =
			resultPagination.length > 0
				? resultPagination[resultPagination.length - 1].id.toString()
				: null;

		const edges = resultPagination.map((item) => {
			const encryptedUrl = this.urlCipherService.generate({
				url: item.story ? item.story.coverImage : null,
				expireIn: 4 * 60 * 60, // Thời gian hết hạn là 4 giờ (tính bằng giây)
				iat: Date.now(), // Thời điểm hiện tại (thời gian tạo)
			}); // Mã hóa URL bằng dịch vụ urlCipherService
			return {
				cursor: item.id,
				node: {
					...item, // Sao chép tất cả các thuộc tính của đối tượng ModerationRequest
					story: {
						...item.story, // Sao chép tất cả các thuộc tính của đối tượng Story
						coverImage: UrlResolverUtils.createUrl(
							'/url-resolver',
							encryptedUrl,
						), // Thay thế coverImage bằng URL đã mã hóa
					},
				},
			};
		});

		return {
			edges,
			totalCount: filteredResult.length,
			hasNextPage,
			hasPreviousPage,
			startCursor,
			endCursor,
		};
	}
	async update(
		id: number,
		status: number,
		reason: string,
	): Promise<ModerationRequest> {
		// Tìm moderation request cần cập nhật
		await this.findOne(id);

		await this.moderationReqRepository.update(
			{ id: id },
			{ status: status, reason: reason, processAt: new Date() },
		);

		return await this.findOne(id);
	}
	async findOne(id: number): Promise<ModerationRequest> {
		const req = await this.moderationReqRepository.findOne({
			where: { id },
		});
		if (!req) {
			throw new NotFoundException('Moderation request not found!');
		}
		return req;
	}

	remove(id: number) {
		return `This action removes a #${id} moderationRequest`;
	}
}
