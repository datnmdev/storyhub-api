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

@WebSocketGateway(Number(process.env.PORT_WS), { cors: true, namespace: "websocket" })
export class ModerationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly moderationRequestService: ModerationRequestService,
    private readonly storyService: StoryService,
  ) {
    console.log(`Websocket server is running on port ${process.env.PORT_WS}`);
  }

  afterInit(socket: Socket): any {
    console.log('Initialized');
  }

  // Kiểm tra kết nối từ client
  handleConnection(client: Socket): any {
    console.log(`Client connected: ${client.id}`);
    client.emit('connection_status', {
      message: 'WebSocket connected successfully.',
    });
  }

  // Kiểm tra ngắt kết nối từ client
  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('create_moderation_request')
  async handleCreateModerationRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() createModerationRequestDto: CreateModerationRequestDto,
  ): Promise<ModerationRequest> {
    try {
      // Gọi service để tạo yêu cầu moderation
      const newRequest =
        await this.moderationRequestService.createModorationReq(
          createModerationRequestDto,
        );
      // Gửi thông báo tới kiểm duyệt viên
      this.server.emit('new_moderation_request', newRequest);

      // Gửi phản hồi cho tác giả
      socket.emit('moderation_request_created', newRequest);

      return newRequest; // Trả về cho client nếu cần
    } catch (error) {
      console.error('Error creating moderation request:', error);
      socket.emit('error', { message: 'Failed to create moderation request' });
      throw error; 
    }
  }

  @SubscribeMessage('handle_moderation_request')
  async handleModerationRequest(
    @ConnectedSocket() socket: Socket,
    @MessageBody() reqId: number,
    reqStatus: number,
    storyId: number,
    storyStatus: number,
  ): Promise<String> {
    try {
      // Thực hiện cập nhật yêu cầu moderation và story song song
      const [req, story] = await Promise.all([
        this.moderationRequestService.update(reqId, reqStatus),
        this.storyService.update({ id: storyId, status: storyStatus }),
      ]);

      // Gửi thông báo tới tác giả
      this.server.emit('story_updated', story);

      // Gửi phản hồi cho kiểm duyệt viên
      socket.emit('moderation_request_updated', req);

      return req; // Trả về cho client nếu cần
    } catch (error) {
      console.error('Error updating moderation request:', error);
      socket.emit('error', { message: 'Failed to update moderation request' });
      throw error; // Ném lỗi để phía server xử lý nếu cần
    }
  }
}
