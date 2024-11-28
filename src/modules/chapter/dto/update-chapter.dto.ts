import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterDto } from './create-chapter.dto';
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
} from 'class-validator';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsOptional()
	@IsNumber()
	order?: number;

	@IsOptional()
	@IsString()
	@Length(1, 255)
	name?: string;

	@IsOptional()
	@IsString()
	content?: string;

	@IsOptional()
	@IsNumber()
	status?: number;
}
