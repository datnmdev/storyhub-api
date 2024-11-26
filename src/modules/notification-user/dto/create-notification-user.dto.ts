import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNotificationUserDto {
	@IsNotEmpty()
	@IsNumber()
	receiverId: number;

	@IsNotEmpty()
	@IsNumber()
	notificationId: number;

	@IsNotEmpty()
	@IsNumber()
	status: number;
}
