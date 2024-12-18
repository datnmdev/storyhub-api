import { Pagination } from "@/common/class/pagination.class";
import { CommentType } from "@/common/constants/comment.constants";
import { JsonToObject } from "@/common/decorators/transform.decorator";
import { IsOrderBy, OneOf } from "@/common/decorators/validation.decorator";
import { OrderBy } from "@/common/types/typeorm.type";
import { Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GetCommentWithFilterDto extends Pagination {
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    id: number

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    @OneOf([
        CommentType.FOR_STORY,
        CommentType.FOR_CHAPTER
    ])
    type: CommentType

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    parentId: number

    @JsonToObject()
    @IsOptional()
    @IsOrderBy([
        'updatedAt',
        'createdAt',
    ])
    orderBy: OrderBy = [['updatedAt', 'DESC'], ['createdAt', 'DESC']]

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    storyId: number

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    chapterId: number

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    readerId: number
}