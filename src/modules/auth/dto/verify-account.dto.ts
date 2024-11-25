import { Number } from "aws-sdk/clients/iot";
import { IsNotEmpty, IsNumber, IsNumberString, IsString, Length } from "class-validator";

export class VerifyAccountDto {
    @IsNotEmpty()
    @IsNumberString()
    @Length(6)
    otp: string

    @IsNotEmpty()
    @IsNumber()
    accountId: Number
}