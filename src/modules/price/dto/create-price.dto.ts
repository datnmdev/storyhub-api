import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePriceDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @IsDateString()
  startTime: Date;

  @IsInt()
  storyId: number;
}
