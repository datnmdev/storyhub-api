import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class SignOutDto {
	@IsNotEmpty()
	@IsString()
	@IsJWT()
	accessToken: string;

    @IsNotEmpty()
	@IsString()
	@IsJWT()
	refreshToken: string;
}