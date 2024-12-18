import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetInteractionDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    commentId: number
}