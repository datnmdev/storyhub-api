import { Module } from '@nestjs/common';
import { NotificationUserService } from './notification-user.service';
import { NotificationUserController } from './notification-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationUser } from '@/database/entities/NotificationUser';

@Module({
	imports: [TypeOrmModule.forFeature([NotificationUser])],
	controllers: [NotificationUserController],
	providers: [NotificationUserService],
	exports: [NotificationUserService],
})
export class NotificationUserModule {}
