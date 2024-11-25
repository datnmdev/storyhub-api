import { Number } from "aws-sdk/clients/iot";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class VerifyAccountDto {
    @IsNotEmpty()
    @IsString()
    @Length(6)
    otp: string

    @IsNotEmpty()
    @IsNumber()
    accountId: Number
}