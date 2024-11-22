import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class PaginateDTO {
  @IsNotEmpty()
  @IsInt()
  take: number;

  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsOptional()
  @IsString()
  keyword?: string;
}
