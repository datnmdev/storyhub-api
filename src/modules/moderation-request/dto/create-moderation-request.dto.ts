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
  processAt: Date | null;

  @IsInt()
  @IsOptional()
  storyId: number | null;

  @IsInt()
  @IsOptional()
  chapterId: number | null;

  @IsInt()
  requesterId: number;

  @IsInt()
  @IsOptional()
  responserId: number | null;
}
