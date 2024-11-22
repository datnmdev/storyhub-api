import { Module } from '@nestjs/common';
import { ModerationRequestService } from './moderation-request.service';
import { ModerationRequestController } from './moderation-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { Account } from '@/database/entities/Account';

@Module({
  imports: [TypeOrmModule.forFeature([ModerationRequest, Account])],
  controllers: [ModerationRequestController],
  providers: [ModerationRequestService],
  exports: [ModerationRequestService],
})
export class ModerationRequestModule {}
