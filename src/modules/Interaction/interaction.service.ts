import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentInteraction } from "./entities/interaction.entity";
import { Repository } from "typeorm";
import { CreateInteractionDto } from "./dto/create-interaction.dto";
import { UpdateInteractionDto } from "./dto/update-interaction.dto";
import { GetInteractionCountDto } from "./dto/get-interaction-count.dto";
import { InteractionType } from "@/common/constants/interaction.type";

@Injectable()
export class InteractionService {
    constructor(
        @InjectRepository(CommentInteraction)
        private readonly commentInteractionRepository: Repository<CommentInteraction>
    ) { }

    getInteraction(readerId: number, commentId: number) {
        return this.commentInteractionRepository.findOne({
            where: {
                readerId,
                commentId
            }
        })
    }

    async getInteractionCount(getInteractionCountDto: GetInteractionCountDto) {
        return {
            likeCount: await this.commentInteractionRepository
                .createQueryBuilder('interaction')
                .andWhere('interaction.commentId = :commentId', {
                    commentId: getInteractionCountDto.commentId
                })
                .andWhere('interaction.interactionType = :interactionType', {
                    interactionType: InteractionType.LIKE
                })
                .getCount(),
            dislikeCount: await this.commentInteractionRepository
                .createQueryBuilder('interaction')
                .andWhere('interaction.commentId = :commentId', {
                    commentId: getInteractionCountDto.commentId
                })
                .andWhere('interaction.interactionType = :interactionType', {
                    interactionType: InteractionType.DISLIKE
                })
                .getCount()
        }
    }

    createInteraction(readerId: number, createInteractionDto: CreateInteractionDto) {
        return this.commentInteractionRepository.save({
            readerId,
            commentId: createInteractionDto.commentId,
            interactionType: createInteractionDto.interactionType
        })
    }

    updateInteraction(readerId: number, updateInteractionDto: UpdateInteractionDto) {
        return this.commentInteractionRepository.update({
            readerId,
            commentId: updateInteractionDto.commentId
        }, {
            interactionType: updateInteractionDto.interactionType
        })
    }

    deleteInteraction(readerId: number, commentId: number) {
        return this.commentInteractionRepository.delete({
            readerId,
            commentId
        })
    }
}