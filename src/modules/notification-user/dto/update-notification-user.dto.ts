import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationUserDto } from './create-notification-user.dto';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateNotificationUserDto extends PartialType(CreateNotificationUserDto) {
	@IsNumber()
	@IsNotEmpty()
	id: number;
}
