import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateReadingHistoryDto {
    @IsNotEmpty()
    @IsString()
    position: string

    @IsNotEmpty()
    @IsInt()
    chapterId: number
}