import { Pagination } from "@/common/class/pagination.class";
import { JsonToObject } from "@/common/decorators/transform.decorator";
import { IsOrderBy } from "@/common/decorators/validation.decorator";
import { OrderBy } from "@/common/types/typeorm.type";
import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class GetChapterWithFilterDto extends Pagination {
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    id?: number

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    order?: number

    @IsOptional()
    @IsString()
    name?: string

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNumber()
    storyId?: number

    @JsonToObject<OrderBy>([
        ["updated_at", "DESC"]
    ])
    @IsOptional()
    @IsOrderBy([
        'created_at',
        'updated_at'
    ])
    orderBy: OrderBy
}