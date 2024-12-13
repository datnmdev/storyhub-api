import { IsNotEmpty, IsNumberString, IsString, Length, Matches } from "class-validator"

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    newPassword: string

    @IsNotEmpty()
    @IsNumberString()
    @Length(6)
    otp: string
}