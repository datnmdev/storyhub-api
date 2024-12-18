import { CommentType } from "@/common/constants/comment.constants";
import { OneOf } from "@/common/decorators/validation.decorator";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsInt()
    @OneOf([
        CommentType.FOR_CHAPTER,
        CommentType.FOR_STORY
    ])
    type: CommentType

    @IsNotEmpty()
    @IsString()
    content: string

    @IsOptional()
    @IsInt()
    parentId: number

    @IsOptional()
    @IsInt()
    storyId: number

    @IsOptional()
    @IsInt()
    chapterId: number
}