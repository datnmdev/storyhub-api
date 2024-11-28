import {
	IsInt,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsDateString,
} from 'class-validator';

export class CreatePriceDto {
	@IsNotEmpty()
	@IsNumberString()
	amount: string;

	@IsOptional()
	@IsDateString()
	startTime: Date;

	@IsNotEmpty()
	@IsInt()
	storyId: number;
}
