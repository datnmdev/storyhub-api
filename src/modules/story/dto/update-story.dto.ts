import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryDto } from './create-story.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStoryDto extends PartialType(CreateStoryDto) {
	@IsNotEmpty()
	@IsInt()
	id: number;
}
