import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAliasDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsInt()
	storyId: number;
}
