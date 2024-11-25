import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator"

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsNumber()
    accountId: number

    @IsNotEmpty()
    @IsString()
    state: string

    @IsNotEmpty()
	@IsString()
	@Matches((/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/))
    newPassword: string
}