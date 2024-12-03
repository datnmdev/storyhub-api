import { IsInt, IsNotEmpty } from "class-validator";

export class FollowDto {
    @IsNotEmpty()
    @IsInt()
    storyId: number
}