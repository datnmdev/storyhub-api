import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { CreateModerationRequestDto } from '@/modules/moderation-request/dto/create-moderation-request.dto';
import { ModerationRequestService } from '@/modules/moderation-request/moderation-request.service';
import { StoryService } from '@/modules/story/story.service';
import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { Account } from '@/database/entities/Account';
import { Moderator } from '@/database/entities/Moderator';
import { NotificationService } from '@/modules/notification/notification.service';
import { NotificationUserService } from '@/modules/notification-user/notification-user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@WebSocketGateway(3000, { cors: true })
export class ModerationGateway
	implements
		OnGatewayInit,
		OnGatewayConnection,
		OnGatewayDisconnect,
		OnGatewayInit
{
	@WebSocketServer() server: Server;

	private moderators: Map<number, string> = new Map();
	private managers: Map<number, string> = new Map();
	private authors: Map<number, string> = new Map();
	private readers: Map<number, string> = new Map();

	constructor(
		@InjectRepository(Moderator)
		private readonly moderatorRepository: Repository<Moderator>,
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>,
		private readonly storyService: StoryService,
		private readonly moderationRequestService: ModerationRequestService,
		private readonly notificationService: NotificationService,
		private readonly notificationUserService: NotificationUserService,
	) {
		console.log(
			`Websocket server is running on port ${process.env.PORT_WS}`,
		);
	}

	afterInit(socket: Socket): any {
		console.log('Initialized');
	}

	private currentIndex = 0;

	async onModuleInit(): Promise<Moderator[]> {
		const moderators = await this.moderatorRepository.find({
			where: {
				status: 0,
			},
		});
		return moderators;
	}

	async handleConnection(client: Socket) {
		const id = client.handshake.query.id as string;
		console.log('Client connected:', client.id, id);
		const role = await this.checkUser(Number(id));
		switch (role) {
			case 1:
				this.managers.set(Number(id), client.id);
				break;
			case 2:
				this.authors.set(Number(id), client.id);
				break;
			case 3:
				this.moderators.set(Number(id), client.id);
				this.mergedArray(); // Gọi lại hàm roundRobin để cập nhật mergedArray sau khi thêm kiểm duyệt viên mới
				break;
			case 4:
				this.readers.set(Number(id), client.id);
				break;
		}
	}

	handleDisconnect(client: Socket): any {
		console.log('Client disconnected:', client.id);
		const moderatorId = Array.from(this.moderators.entries()).find(
			([id, socketId]) => socketId === client.id,
		)?.[0];
		if (moderatorId !== undefined) {
			this.moderators.delete(moderatorId);
			this.mergedArray(); // Gọi lại hàm roundRobin để cập nhật mergedArray sau khi xóa kiểm duyệt viên
		}
	}

	async mergedArray() {
		const moderatorsDB = await this.onModuleInit();
		let mergedArray;

		// Kiểm tra xem mảng B có trống không
		if (this.moderators.size === 0) {
			// Nếu trống, lấy luôn mảng A
			mergedArray = moderatorsDB; // Gán giá trị cho mergedArray
		} else {
			// Tạo một Set để lưu trữ các ID từ mảng B
			const idsInB = new Set(Array.from(this.moderators.keys()));
			// Kết hợp các đối tượng trong B và các đối tượng trong A không có ID trong B
			mergedArray = [
				...Array.from(this.moderators.entries()).map(
					([id, socketId]) => ({ id, socketId }),
				), // Chuyển các phần tử của Set thành các object
				...moderatorsDB
					.filter((item) => !idsInB.has(item.id))
					.map((item) => ({ id: item.id })), // Thêm các đối tượng từ A mà không có ID trong B
			];
		}
		console.log('mergedArray', mergedArray);
		return mergedArray;
	}

	async roundRobin(mergedArray: any[]): Promise<number> {
		// Lấy id hiện tại
		const id = mergedArray[this.currentIndex].id;
		// Cập nhật chỉ số hiện tại
		this.currentIndex = (this.currentIndex + 1) % mergedArray.length;
		return id;
	}
	@SubscribeMessage('create_moderation_request')
	async createModerationRequest(
		@ConnectedSocket() socket: Socket,
		@MessageBody() createModerationRequestDto: CreateModerationRequestDto,
	): Promise<ModerationRequest> {
		const responserId = await this.roundRobin(await this.mergedArray());
		const reviewRequest =
			await this.moderationRequestService.createModorationReq({
				...createModerationRequestDto,
				responserId: responserId,
			});
		const notification = await this.notificationService.create({
			type: 0,
			moderationRequestId: reviewRequest.id,
		});
		await this.notificationUserService.create({
			receiverId: responserId,
			notificationId: notification.id,
			status: 0,
		});
		// Gửi yêu cầu cho kiểm duyệt viên
		this.server
			.to(responserId.toString())
			.emit('newReviewRequest', reviewRequest);
		// Gửi phản hồi cho tác giả
		socket.emit('review_request_created', reviewRequest);
		return reviewRequest; // Đảm bảo trả về giá trị
	}

	@SubscribeMessage('handle_moderation_request')
	async handleModerationRequest(
		@ConnectedSocket() socket: Socket,
		@MessageBody()
		data: {
			reqId: number;
			reqStatus: number;
			storyId: number;
			storyStatus: number;
			reason: string;
		},
	): Promise<ModerationRequest> {
		try {
			//Thực hiện cập nhật yêu cầu moderation và story song song
			const [req, story] = await Promise.all([
				this.moderationRequestService.update(
					data.reqId,
					data.reqStatus,
				),
				this.storyService.update({
					id: data.storyId,
					status: data.storyStatus,
				}),
			]);

			const notification = await this.notificationService.create({
				type: 0,
				moderationRequestId: data.reqId,
			});
			await this.notificationUserService.create({
				receiverId: req.requesterId,
				notificationId: notification.id,
				status: 0,
			});

			// Gửi thông báo tới tác giả
			this.server
				.to(req.requesterId.toString())
				.emit('story_updated', story, data.reason);

			// Gửi phản hồi cho kiểm duyệt viên
			socket.emit('moderation_request_updated', req);

			return req; // Trả về cho client nếu cần
		} catch (error) {
			console.error('Error updating moderation request:', error);
			socket.emit('error', {
				message: 'Failed to update moderation request',
			});
			throw error; // Ném lỗi để phía server xử lý nếu cần
		}
	}

	private async checkUser(id: number): Promise<number> {
		const account = await this.accountRepository.findOne({
			where: {
				id: id,
			},
			relations: ['role'],
		});

		const roleOrder = {
			'Người quản lý': 1,
			'Tác giả': 2,
			'Kiểm duyệt viên': 3,
			'Độc giả': 4,
		};

		return roleOrder[account.role.name] || -1; // Trả về thứ tự vai trò nếu có, ngược lại trả về -1
	}
}
