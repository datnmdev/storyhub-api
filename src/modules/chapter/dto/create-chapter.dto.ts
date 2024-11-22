import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  content?: string | null;

  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsNumber()
  storyId: number;
}
