import { CreateGenreDto } from '@/modules/genre/dto/create-genre.dto';
import { IsNotEmpty, IsInt, IsOptional, IsString, IsDate } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  coverImage: string;

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
}
