import { Pagination } from "@/common/class/pagination.class"
import { Transform } from "class-transformer"
import { IsInt, IsOptional } from "class-validator"

export class GetInvoiceDto extends Pagination {
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    chapterId?: number
}