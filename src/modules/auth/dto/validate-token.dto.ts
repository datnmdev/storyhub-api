import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
	@IsNotEmpty()
	@IsString()
	@IsJWT()
	accessToken: string;
}
