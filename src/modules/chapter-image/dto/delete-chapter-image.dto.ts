import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DeleteChapterImageDto {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	fileName: string;
}
