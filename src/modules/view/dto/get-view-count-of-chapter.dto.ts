import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetViewCountOfChapterDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    chapterId: number
}