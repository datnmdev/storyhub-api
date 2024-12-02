import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetFollowerCountDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    storyId: number
}