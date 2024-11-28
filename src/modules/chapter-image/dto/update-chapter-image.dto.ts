import { PartialType } from '@nestjs/mapped-types';
import { CreateChapterImageDto } from './create-chapter-image.dto';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateChapterImageDto extends PartialType(CreateChapterImageDto) {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsNumber()
	@IsNotEmpty()
	order: number;

	@IsString()
	@IsNotEmpty()
	path: string;

  @IsNumber()
  @IsNotEmpty()
  chapterId: number;

}
