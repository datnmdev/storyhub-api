import { Pagination } from "@/common/class/pagination.class"
import { StoryStatus, StoryType } from "@/common/constants/story.constants"
import { JsonToObject } from "@/common/decorators/transform.decorator"
import { ArrayElementsIn, IsOrderBy } from "@/common/decorators/validation.decorator"
import { OrderBy } from "@/common/types/typeorm.type"
import { Transform } from "class-transformer"
import { IsArray, IsInt, IsNumber, IsOptional, IsString, Validate } from "class-validator"

export class GetStoryWithFilterDto extends Pagination {
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    id?: number

    @IsOptional()
    @IsString()
    title?: string

    @JsonToObject<number[]>([
        StoryType.COMIC, 
        StoryType.NOVEL
    ])
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayElementsIn([
        StoryType.NOVEL,
        StoryType.COMIC
    ])
    type: number[]

    @JsonToObject<number[]>([
        StoryStatus.PUBLISHING, 
        StoryStatus.FINISHED
    ])
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayElementsIn([
        StoryStatus.PUBLISHING,
        StoryStatus.FINISHED
    ])
    status: number[]

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    countryId?: number

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    authorId?: number

    @JsonToObject()
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    genres?: number[]

    @JsonToObject<OrderBy>([
        ["updated_at", "DESC"]
    ])
    @IsOptional()
    @IsOrderBy([
        'created_at',
        'updated_at',
        'id'
    ])
    orderBy: OrderBy
}