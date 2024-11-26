import { IsInt, IsOptional, IsString, IsDate, IsNumber } from 'class-validator';

export class CreateModerationRequestDto {
  @IsString()
  @IsOptional()
  reason: string | null;

  @IsInt()
  status: number;

  @IsInt()
  type: number;

  @IsDate()
  @IsOptional()
  processAt?: Date;

  @IsInt()
  @IsOptional()
  storyId?: number;

  @IsInt()
  @IsOptional()
  chapterId?: number;

  @IsInt()
  requesterId: number;

  @IsInt()
  @IsOptional()
  responserId?: number;
}
