import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, Min } from "class-validator"

export class Pagination {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    page: number

    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    limit: number
}