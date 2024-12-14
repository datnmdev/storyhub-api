import { ChapterImage } from "@/database/entities/ChapterImage";
import { History } from "@/modules/reading-history/entities/reading-history.entity";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetChapterContentDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    chapterId: number
}

@Exclude()
export class TextContentDto {
    @Expose()
    id: number

    @Expose()
    order: number

    @Expose()
    name: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    content: string

    @Expose()
    history: History
    
    @Expose()
    storyId: number
}

@Exclude()
export class ImageContentDto {
    @Expose()
    id: number

    @Expose()
    order: number

    @Expose()
    name: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    history: History

    @Expose()
    images: ChapterImage[]
    
    @Expose()
    storyId: number
}