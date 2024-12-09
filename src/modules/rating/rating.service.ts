import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RatingDetail } from "./entities/rating-detail.entity";
import { DataSource, Repository } from "typeorm";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { GetTopRatingStoryDto } from "./dto/get-top-rating-story.dto";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { Story } from "@/database/entities/Story";
import { plainToInstance } from "class-transformer";
import UrlResolverUtils from "@/common/utils/url-resolver.util";
import { UrlCipherPayload } from "@/common/url-cipher/url-cipher.class";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(RatingDetail)
        private readonly ratingRepository: Repository<RatingDetail>,
        private readonly dataSource: DataSource,
        private readonly urlCipherService: UrlCipherService
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

    async getTopRatingStory(getTopRatingStoryDto: GetTopRatingStoryDto) {
        const [result] = await this.dataSource.query(
            `CALL getTopRatingStories(?, ?)`,
            [
                getTopRatingStoryDto.page,
                getTopRatingStoryDto.limit
            ]
        );

        const genres = [];
        for (let row of result) {
            const story = await this.dataSource
                .createQueryBuilder(Story, 'story')
                .innerJoinAndSelect('story.genres', 'genres')
                .where(`story.id = ${row.id}`)
                .getOne();
            genres.push(story.genres)
        }

        const authors = [];
        for (let row of result) {
            const story = await this.dataSource
                .createQueryBuilder(Story, 'story')
                .innerJoinAndSelect('story.author', 'author')
                .innerJoinAndSelect('author.user', 'user')
                .where(`story.id = ${row.id}`)
                .getOne();
            authors.push(story.author)
        }

        return [
            result.map((row, index) => {
                return {
                    ...plainToInstance(Story, {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        note: row.note,
                        coverImage: UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
                            url: row.cover_image,
                            expireIn: 4 * 60 * 60,
                            iat: Date.now()
                        } as UrlCipherPayload))),
                        type: row.type,
                        status: row.status,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at,
                        countryId: row.country_id,
                        authorId: row.author_id,
                        genres: genres[index],
                        author: authors[index]
                    } as Story),
                    ratingSummary: {
                        starsCount: Number(row.starsCount),
                        ratingCount: Number(row.ratingCount)
                    }
                }
            }),
            await this.dataSource
                .createQueryBuilder(Story, 'story')
                .getCount()
        ]
    }
}