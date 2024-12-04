import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RatingDetail } from "./entities/rating-detail.entity";
import { Repository } from "typeorm";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(RatingDetail)
        private readonly ratingRepository: Repository<RatingDetail>
    ) {}

    getRating(userId: number, storyId: number) {
        return this.ratingRepository.findOne({
            where: {
                readerId: userId,
                storyId
            }
        })
    }

    getRatingCount(storyId: number) {
        return this.ratingRepository
            .createQueryBuilder("rating_detail")
            .where("rating_detail.story_id = :storyId", {
                storyId
            })
            .getCount();
    }

    async getRatingSummary(storyId: number) {
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

    async create(userId: number, createRatingDto: CreateRatingDto) {
        return this.ratingRepository.save({
            readerId: userId,
            storyId: createRatingDto.storyId,
            stars: createRatingDto.stars
        })
    }

    async update(userId: number, updateRatingDto: UpdateRatingDto) {
        const res = await this.ratingRepository.update({
            readerId: userId,
            storyId: updateRatingDto.storyId
        }, {
            stars: updateRatingDto.stars
        })

        if (res.affected && res.affected > 0) {
            return true;
        }

        return false;
    }
}