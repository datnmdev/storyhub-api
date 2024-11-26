import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModerationRequestDto } from './dto/create-moderation-request.dto';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ModerationRequestService {
	constructor(
		@InjectRepository(ModerationRequest)
		private readonly moderationReqRepository: Repository<ModerationRequest>,
	) {}
	async createModorationReq(
		createModerationRequestDto: CreateModerationRequestDto,
	): Promise<ModerationRequest> {
		return await this.moderationReqRepository.save(
			createModerationRequestDto,
		);
	}

	findAll() {
		return `This action returns all moderationRequest`;
	}
	async update(id: number, status: number): Promise<ModerationRequest> {
		// Tìm moderation request cần cập nhật
		await this.findOne(id);

		await this.moderationReqRepository.update(
			{ id: id },
			{ status: status },
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
