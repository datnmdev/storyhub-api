import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class HandleModerationRequestDto {
	@IsNotEmpty()
	@IsNumber()
	reqId: number;

	@IsNotEmpty()
	@IsNumber()
	reqStatus: number;

	@IsNotEmpty()
	@IsNumber()
	storyId: number;

	@IsNotEmpty()
	@IsNumber()
	storyStatus: number;

	@IsOptional()
	@IsString()
	reason?: string;
}
