import { IsInt, IsString } from 'class-validator';

export class CreateAliasDto {
  @IsString()
  name: string;

  @IsInt()
  storyId: number;
}
