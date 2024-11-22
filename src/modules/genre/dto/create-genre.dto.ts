import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  description?: string | null;

  @IsNotEmpty()
  @IsInt()
  creatorId: number;
}
