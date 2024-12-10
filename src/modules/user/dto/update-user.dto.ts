import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsNotEmpty, IsDate, IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
	id: number;

	@IsString()
	@IsNotEmpty()
	name: string;

  @IsOptional()
	@IsDateString()
	dob?: Date;

	@IsNumber()
	@IsOptional()
	gender?: number;

	@IsString()
	@IsOptional()
	phone?: string;

	@IsString()
	@IsOptional()
	avatar?: string;
}
