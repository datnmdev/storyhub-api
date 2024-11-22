import { Module } from '@nestjs/common';
import { ModerationGateway } from './moderation.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { ModerationRequestModule } from '@/modules/moderation-request/moderation-request.module';
import { StoryModule } from '@/modules/story/story.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModerationRequest]),
    ModerationRequestModule,
    StoryModule,
  ],
  providers: [ModerationGateway],
})
export class EventsModule {}
