import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteCommentDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    id: number
}