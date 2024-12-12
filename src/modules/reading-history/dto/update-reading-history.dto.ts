import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateReadingHistoryDto {
    @IsNotEmpty()
    @IsString()
    position: string

    @IsNotEmpty()
    @IsInt()
    chapterId: number
}