import { OtpVerificationType } from "@/common/constants/oauth.constants"
import { OneOf } from "@/common/decorators/validation.decorator"
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator"

export class ResendOtpDto {
    @IsNotEmpty()
    @IsNumber()
    @OneOf([
        OtpVerificationType.SIGN_IN,
        OtpVerificationType.SIGN_UP,
        OtpVerificationType.FORGOT_PASSWORD
    ])
    type: number

    @IsNotEmpty()
    @IsEmail()
    email: string
}