import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class GetAliasByStoryIdDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    storyId: number
}