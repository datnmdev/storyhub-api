import { InteractionType } from "@/common/constants/interaction.type";
import { OneOf } from "@/common/decorators/validation.decorator";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateInteractionDto {
    @IsNotEmpty()
    @IsInt()
    commentId: number

    @IsNotEmpty()
    @IsInt()
    @OneOf([
        InteractionType.LIKE,
        InteractionType.DISLIKE
    ])
    interactionType: InteractionType
}