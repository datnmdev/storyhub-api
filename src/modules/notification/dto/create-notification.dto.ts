import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateNotificationDto {
	@IsNumber()
	@IsNotEmpty()
	type: number;

	@IsNumber()
	@IsOptional()
	moderationRequestId?: number;

	@IsNumber()
	@IsOptional()
	responseCommentId?: number;

	@IsNumber()
	@IsOptional()
	depositeTransactionId?: number;

	@IsNumber()
	@IsOptional()
	withdrawRequestId?: number;
}
