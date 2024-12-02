import { Transform } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty } from "class-validator";

export class getViewCountOfStoryDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    storyId: number
}