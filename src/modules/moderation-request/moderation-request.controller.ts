import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModerationRequestService } from './moderation-request.service';
import { CreateModerationRequestDto } from './dto/create-moderation-request.dto';
import { ModerationRequest } from '@/database/entities/ModerationRequest';

@Controller('moderation-request')
export class ModerationRequestController {
  constructor(private readonly moderationRequestService: ModerationRequestService) {}

  @Post()
  async create(
    @Body() createModerationRequestDto: CreateModerationRequestDto,
  ): Promise<ModerationRequest> {
    return this.moderationRequestService.createModorationReq(
      createModerationRequestDto,
    );
  }

  @Get()
  findAll() {
    return this.moderationRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moderationRequestService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moderationRequestService.remove(+id);
  }
}
