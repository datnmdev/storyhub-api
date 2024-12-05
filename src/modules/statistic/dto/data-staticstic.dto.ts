import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DataStaticsticDto {
	@IsNotEmpty()
	@IsNumber()
	authorId: number;

	@IsNotEmpty()
	@IsNumber()
	type: number;

	@IsNotEmpty()
	@IsDateString()
	startDate: Date;

	@IsNotEmpty()
	@IsDateString()
	endDate: Date;
}
