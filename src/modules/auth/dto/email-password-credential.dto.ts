import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class EmailPasswordCredentialDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    password: string
}