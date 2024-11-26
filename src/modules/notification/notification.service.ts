import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '@/database/entities/Notification';

@Injectable()
export class NotificationService {
	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
	) {}
	async create(
		createNotificationDto: CreateNotificationDto,
	): Promise<Notification> {
		return this.notificationRepository.save(createNotificationDto);
	}

	findAll() {
		return `This action returns all notification`;
	}

	findOne(id: number) {
		return `This action returns a #${id} notification`;
	}

	update(id: number, updateNotificationDto: UpdateNotificationDto) {
		return `This action updates a #${id} notification`;
	}

	remove(id: number) {
		return `This action removes a #${id} notification`;
	}
}
