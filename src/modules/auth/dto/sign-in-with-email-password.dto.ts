import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignInWithEmailPasswordDto {
	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}