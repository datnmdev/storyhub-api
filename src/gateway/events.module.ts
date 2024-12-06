import { Module } from '@nestjs/common';
import { ModerationGateway } from './moderation.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { ModerationRequestModule } from '@/modules/moderation-request/moderation-request.module';
import { StoryModule } from '@/modules/story/story.module';
import { Account } from '@/database/entities/Account';
import { User } from '@/database/entities/User';
import { Moderator } from '@/database/entities/Moderator';
import { NotificationUserModule } from '../modules/notification-user/notification-user.module';
import { NotificationModule } from '@/modules/notification/notification.module';
import { FollowModule } from '@/modules/follow/follow.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ModerationRequest, Account, Moderator, User]),
		ModerationRequestModule,
		StoryModule,
		NotificationModule,
		NotificationUserModule,
		FollowModule,
	],
	providers: [ModerationGateway],
	exports: [ModerationGateway],
})
export class EventsModule {}
