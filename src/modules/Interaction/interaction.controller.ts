import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { InteractionService } from "./interaction.service";
import { CreateInteractionDto } from "./dto/create-interaction.dto";
import { User } from "@/common/decorators/user.decorator";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";
import { DeleteInteractionDto } from "./dto/delete-interaction.dto";
import { GetInteractionCountDto } from "./dto/get-interaction-count.dto";
import { GetInteractionDto } from "./dto/get-interaction.dto";

@Controller('interaction')
export class InteractionController {
    constructor(
        private readonly interactionService: InteractionService
    ) {}

    @Get()
    getInteraction(@User('userId') userId: number, @Query() getInteractionDto: GetInteractionDto) {
        return this.interactionService.getInteraction(userId, getInteractionDto.commentId);
    }

    @Get('/count')
    getInteractionCount(@Query() getInteractionCountDto: GetInteractionCountDto) {
        return this.interactionService.getInteractionCount(getInteractionCountDto);
    }

    @Post()
    createInteraction(@User('userId') userId: number, @Body() createInteractionDto: CreateInteractionDto) {
        return this.interactionService.createInteraction(userId, createInteractionDto);
    }

    @Put()
    updateInteraction(@User('userId') userId: number, @Body() updateInteractionDto: UpdateInteractionDto) {
        return this.interactionService.updateInteraction(userId, updateInteractionDto);
    }

    @Delete()
    deleteInteraction(@User('userId') userId: number, @Query() deleteInteractionDto: DeleteInteractionDto) {
        return this.interactionService.deleteInteraction(userId, deleteInteractionDto.commentId);
    }
}