import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class PaginateStoriesDTO {
	@IsNotEmpty()
	@IsInt()
	take: number;

	@IsNotEmpty()
	@IsInt()
	page: number;

	@IsOptional()
	@IsInt()
	type?: number;

	@IsOptional()
	@IsInt()
	status?: number;

	@IsOptional()
	@IsString()
	keyword?: string;

	@IsOptional()
	@IsInt()
	authorId?: number;
}
