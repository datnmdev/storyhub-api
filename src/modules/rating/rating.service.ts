import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RatingDetail } from "./entities/rating-detail.entity";
import { Repository } from "typeorm";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(RatingDetail)
        private readonly ratingRepository: Repository<RatingDetail>
    ) {}

    getRatingCount(storyId: number) {
        return this.ratingRepository
            .createQueryBuilder("rating_detail")
            .where("rating_detail.story_id = :storyId", {
                storyId
            })
            .getCount();
    }

    async getRating(storyId: number) {
        const ratingSummary = await this.ratingRepository
            .createQueryBuilder('rating_detail')
            .where("rating_detail.story_id = :storyId", {
                storyId
            })
            .select([
                'IFNULL(SUM(rating_detail.stars), 0) AS starCount',
                'COUNT(*) AS ratingCount'
            ])
            .getRawOne()

        return {
            starCount: Number(ratingSummary.starCount),
            ratingCount: Number(ratingSummary.ratingCount)
        }
    }
}