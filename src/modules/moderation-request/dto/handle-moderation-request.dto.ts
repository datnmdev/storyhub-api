import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class HandleModerationRequestDto {
	@IsNotEmpty()
	@IsNumber()
	reqId: number;

	@IsNotEmpty()
	@IsNumber()
	reqStatus: number;

	@IsOptional()
	@IsNumber()
	storyId?: number;

	@IsOptional()
	processAt?: Date;

	@IsOptional()
	@IsNumber()
	storyStatus?: number;

	@IsOptional()
	@IsString()
	reason?: string;

	@IsNotEmpty()
	@IsNumber()
	chapterId: number;

	@IsNotEmpty()
	@IsNumber()
	chapterStatus: number;
}
