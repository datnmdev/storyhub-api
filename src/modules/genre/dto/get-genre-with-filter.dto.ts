import { Pagination } from "@/common/class/pagination.class"
import { Transform } from "class-transformer"
import { IsInt, IsNumber, IsOptional, IsString } from "class-validator"

export class GetGenreWithFilterDto extends Pagination {
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    id?: number

    @IsOptional()
    @IsString()
    name?: string
}