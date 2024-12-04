import { IsInt, IsNotEmpty } from "class-validator";

export class CreateInvoiceDto {
    @IsNotEmpty()
    @IsInt()
    chapterId: number
}