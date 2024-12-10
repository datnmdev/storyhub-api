import { IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';

export class PaginateModerationReqDTO {
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
	@IsString()
	keyword?: string;

}
