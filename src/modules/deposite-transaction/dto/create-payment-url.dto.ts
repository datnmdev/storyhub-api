import { BankCode } from "@/common/constants/deposite-transaction.constants";
import { OneOf } from "@/common/decorators/validation.decorator";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreatePaymentUrlDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    @Min(10000)
    amount: number;

    @IsNotEmpty()
    @IsString()
    @OneOf([
        BankCode.VNPAYQR,
        BankCode.VNBANK,
        BankCode.INTCARD
    ])
    bankCode: string;
}