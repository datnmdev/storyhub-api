import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChapterImageDto {
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
