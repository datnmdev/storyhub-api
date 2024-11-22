import { PartialType } from '@nestjs/mapped-types';
import { CreateAliasDto } from './create-alias.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAliasDto extends PartialType(CreateAliasDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
