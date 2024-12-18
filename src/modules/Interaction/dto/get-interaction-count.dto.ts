import { Transform } from "class-transformer"
import { IsInt, IsNotEmpty } from "class-validator"

export class GetInteractionCountDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    commentId: number

    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    readerId: number
}