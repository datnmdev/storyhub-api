import { Injectable } from '@nestjs/common';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
import { UpdateNotificationUserDto } from './dto/update-notification-user.dto';
import { NotificationUser } from '@/database/entities/NotificationUser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationUserService {
	constructor(
		@InjectRepository(NotificationUser)
		private notificationUserRepository: Repository<NotificationUser>,
	) {}

	async create(
		createNotificationUserDto: CreateNotificationUserDto,
	): Promise<NotificationUser> {
		return this.notificationUserRepository.save(createNotificationUserDto);
	}

	async findAll(id: number): Promise<any[]> {
		const notifications = await this.notificationUserRepository.find({
			where: { receiverId: id },
			order: { createdAt: 'DESC' },
			relations: [
				'notification.moderationRequest',
				'notification.moderationRequest.story',
			],
		});
		const filteredNotifications = notifications.map((notification) => {
			return {
				...notification,
				notification: Object.fromEntries(
					Object.entries(notification.notification).filter(
						([key, value]) => value !== null,
					),
				),
			};
		});

		return filteredNotifications;
	}

	findOne(id: number) {
		return `This action returns a #${id} notificationUser`;
	}

	async update(updateNotificationUserDto: UpdateNotificationUserDto) {
		const id = {
			receiverId: updateNotificationUserDto.receiverId,
			notificationId: updateNotificationUserDto.notificationId,
		};

		await this.notificationUserRepository.update(
			id,
			updateNotificationUserDto,
		);

		return 'Cập nhật thành công';
	}

	remove(id: number) {
		return `This action removes a #${id} notificationUser`;
	}
}
