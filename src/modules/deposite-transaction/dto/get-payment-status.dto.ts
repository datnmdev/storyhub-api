import { IsNotEmpty, IsString } from "class-validator";

export class GetPaymentStatusDto {
    @IsNotEmpty()
    @IsString()
    orderId: string
}