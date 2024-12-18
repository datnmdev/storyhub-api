import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteInteractionDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    commentId: number
}