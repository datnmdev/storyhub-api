import { Genre } from '@/database/entities/Genre';
import { CreateGenreDto } from '@/modules/genre/dto/create-genre.dto';
import {
	IsNotEmpty,
	IsInt,
	IsOptional,
	IsString,
	IsDate,
	IsNumberString,
  IsObject,
} from 'class-validator';

export class CreateStoryDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	note?: string;

	@IsOptional()
	@IsString()
	coverImage?: string;

	@IsNotEmpty()
	@IsInt()
	type: number;

	@IsNotEmpty()
	@IsInt()
	status: number;

	@IsNotEmpty()
	@IsInt()
	countryId: number;

	@IsNotEmpty()
	@IsInt()
	authorId: number;

	@IsOptional()
	genres?: number[];

	@IsOptional()
	@IsString()
	alias?: string;

	@IsOptional()
	@IsObject()
	price?: {
		amount: string;
		startTime: string;
	};
}
