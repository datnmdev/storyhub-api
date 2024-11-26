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
import { NotificationUserService } from './notification-user.service';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
import { UpdateNotificationUserDto } from './dto/update-notification-user.dto';
import { NotificationUser } from '@/database/entities/NotificationUser';

@Controller('notification-user')
export class NotificationUserController {
	constructor(
		private readonly notificationUserService: NotificationUserService,
	) {}

	@Post()
	create(
		@Body() createNotificationUserDto: CreateNotificationUserDto,
	): Promise<NotificationUser> {
		return this.notificationUserService.create(createNotificationUserDto);
	}

	@Get('all/:id')
	async findAll(@Param('id') id: number) {
		return this.notificationUserService.findAll(id);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.notificationUserService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateNotificationUserDto: UpdateNotificationUserDto,
	) {
		return this.notificationUserService.update(
			+id,
			updateNotificationUserDto,
		);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.notificationUserService.remove(+id);
	}
}
