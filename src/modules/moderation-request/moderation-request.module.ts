import { Module } from '@nestjs/common';
import { ModerationRequestService } from './moderation-request.service';
import { ModerationRequestController } from './moderation-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationRequest } from '@/database/entities/ModerationRequest';

@Module({
	imports: [TypeOrmModule.forFeature([ModerationRequest])],
	controllers: [ModerationRequestController],
	providers: [ModerationRequestService],
	exports: [ModerationRequestService],
})
export class ModerationRequestModule {}
