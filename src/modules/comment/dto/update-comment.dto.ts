import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateCommentDto {
    @IsNotEmpty()
    @IsInt()
    id: number

    @IsNotEmpty()
    @IsString()
    content: string
}