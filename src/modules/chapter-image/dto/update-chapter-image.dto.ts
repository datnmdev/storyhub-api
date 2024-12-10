import { IsNotEmpty, IsNumber,  } from 'class-validator';

export class UpdateChapterImageDto {
	@IsNumber()
	@IsNotEmpty()
	id: number;

	@IsNumber()
	@IsNotEmpty()
	order: number;
}
