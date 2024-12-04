import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateRatingDto {
    @IsNotEmpty()
    @IsInt()
    storyId: number

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    stars: number
}