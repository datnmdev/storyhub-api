import { Module } from "@nestjs/common";
import { InteractionController } from "./interaction.controller";
import { InteractionService } from "./interaction.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentInteraction } from "./entities/interaction.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CommentInteraction
        ])
    ],
    controllers: [
        InteractionController
    ],
    providers: [
        InteractionService
    ]
})
export class InteractionModule {}