import { IsEmail, IsNotEmpty, IsNumberString, Length } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsNumberString()
    @Length(6)
    otp: string
}