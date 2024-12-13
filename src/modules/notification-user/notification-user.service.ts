import { Injectable } from '@nestjs/common';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
import { UpdateNotificationUserDto } from './dto/update-notification-user.dto';
import { NotificationUser } from '@/database/entities/NotificationUser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
@Injectable()
export class NotificationUserService {
	constructor(
		@InjectRepository(NotificationUser)
		private notificationUserRepository: Repository<NotificationUser>,
		private readonly urlCipherService: UrlCipherService,
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
				'notification.moderationRequest.chapter',
				'notification.moderationRequest.chapter.story',
				'notification.moderationRequest.chapter.story.aliases',
				'notification.moderationRequest.chapter.story.country',
				'notification.moderationRequest.chapter.story.author.user',
				'notification.moderationRequest.chapter.story.genres',
				'notification.moderationRequest.chapter.story.prices',
				'notification.moderationRequest.chapter.chapterImages',
			],
		});

		return notifications.map(notification => {
			const filteredNotification = {
				...notification,
				notification: Object.fromEntries(
					Object.entries(notification.notification).filter(
						([key, value]) => value !== null,
					),
				),
			};

			const encryptedUrl = this.urlCipherService.generate({
				url: filteredNotification.notification.moderationRequest.chapter
					.story.coverImage,
				expireIn: 4 * 60 * 60, // Thời gian hết hạn là 4 giờ (tính bằng giây)
				iat: Date.now(), // Thời điểm hiện tại (thời gian tạo)
			}); // Mã hóa URL bằng dịch vụ urlCipherService

			return {
				...filteredNotification,
				notification: {
					...filteredNotification.notification,
					moderationRequest: {
						...filteredNotification.notification.moderationRequest,
						chapter: {
							...filteredNotification.notification.moderationRequest.chapter,
							story: {
								...filteredNotification.notification.moderationRequest.chapter.story,
								coverImage: UrlResolverUtils.createUrl(
									'/url-resolver',
									encryptedUrl,
								), // Thay thế coverImage bằng URL đã mã hóa
							},
							chapterImages: filteredNotification.notification.moderationRequest.chapter.chapterImages
								.map(image => ({
									path: UrlResolverUtils.createUrl(
										'/url-resolver',
										this.urlCipherService.generate({
											url: image.path,
											expireIn: 4 * 60 * 60,
											iat: Date.now(),
										}),
									),
									order: image.order,
								}))
								.sort((a, b) => a.order - b.order),
						},
					},
				},
			};
		});
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
