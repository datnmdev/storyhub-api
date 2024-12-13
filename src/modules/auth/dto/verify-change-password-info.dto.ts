import { IsNotEmpty, IsString, Matches } from "class-validator"

export class VerifyChangePasswordInfoDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    newPassword: string
}