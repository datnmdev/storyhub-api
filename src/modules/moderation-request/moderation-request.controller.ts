import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import { ModerationRequestService } from './moderation-request.service';
import { CreateModerationRequestDto } from './dto/create-moderation-request.dto';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { IPaginatedType } from '@/pagination/paginated.decorator';
import { PaginateStoriesDTO } from '@/pagination/paginated-stories.dto';

@Controller('moderation-request')
export class ModerationRequestController {
	constructor(
		private readonly moderationRequestService: ModerationRequestService,
	) {}

	@Post()
	async create(
		@Body() createModerationRequestDto: CreateModerationRequestDto,
	): Promise<ModerationRequest> {
		return this.moderationRequestService.createModorationReq(
			createModerationRequestDto,
		);
	}

	@Get()
	findAllModerationReq(
		@Query() paginationQuery: any,
	): Promise<IPaginatedType<ModerationRequest>> {
		const paginationDto = new PaginateStoriesDTO();
		Object.assign(paginationDto, paginationQuery);
		return this.moderationRequestService.findAll(paginationDto);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<ModerationRequest> {
		return await this.moderationRequestService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.moderationRequestService.remove(+id);
	}
}
