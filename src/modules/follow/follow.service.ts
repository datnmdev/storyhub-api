import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { FollowDetail } from "./entities/follow-detail.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GetTopFollowStoryDto } from "./dto/get-top-follow-story.dto";
import { Story } from "@/database/entities/Story";
import { plainToInstance } from "class-transformer";
import UrlResolverUtils from "@/common/utils/url-resolver.util";
import { UrlCipherPayload } from "@/common/url-cipher/url-cipher.class";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { GetFollowWithFilterDto } from "./dto/get-follow-with-filter.dto";
import { ChapterInfoPublicDto } from "../chapter/dto/get-chapter-with-filter.dto";

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(FollowDetail)
        private readonly followRepository: Repository<FollowDetail>,
        private readonly dataSource: DataSource,
        private readonly urlCipherService: UrlCipherService
    ) { }

    getFollowerCount(storyId: number) {
        return this.followRepository
            .createQueryBuilder('follow_detail')
            .where("follow_detail.story_id = :storyId", {
                storyId
            })
            .getCount();
    }

    getFollow(userId: number, storyId: number) {
        return this.followRepository.findOne({
            where: {
                storyId,
                readerId: userId
            }
        })
    }

    follow(userId: number, storyId: number) {
        return this.followRepository.save({
            storyId,
            readerId: userId
        })
    }

    async unfollow(userId: number, storyId: number) {
        const result = await this.followRepository.delete({
            storyId,
            readerId: userId
        })

        if (result.affected && result.affected > 0) {
            return true;
        }

        return false;
    }

    async getListReaderId(storyId: number): Promise<number[]> {
        const followers = await this.followRepository.find({
            where: {
                storyId,
            },
            select: ['readerId'],
        });

        return followers.map((follower) => follower.readerId);
    }

    async getTopFollowStory(getTopFollowStoryDto: GetTopFollowStoryDto) {
        const [result] = await this.dataSource.query(
            `CALL getTopFollowStories(?, ?)`,
            [
                getTopFollowStoryDto.page,
                getTopFollowStoryDto.limit
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
                    followCount: Number(row.followCount)
                }
            }),
            await this.dataSource
                .createQueryBuilder(Story, 'story')
                .getCount()
        ]
    }

    async getFollowWithFilter(userId: number, getFollowWithFilterDto: GetFollowWithFilterDto) {
        try {
            
        } catch (error) {
            
        }
        const results = await this.followRepository
            .createQueryBuilder('follow')
            .innerJoinAndSelect('follow.story', 'story')
            .innerJoinAndSelect('story.chapters', 'chapter')
            .where('follow.reader_id = :readerId', {
                readerId: userId
            })
            .andWhere(new Brackets(qb => {
                if (getFollowWithFilterDto.storyId !== undefined) {
                    qb.andWhere('follow.story_id = :storyId', {
                        storyId: getFollowWithFilterDto.storyId
                    })
                }
            }))
            .orderBy('follow.createdAt', 'DESC')
            .addOrderBy('follow.storyId', 'DESC')
            .take(getFollowWithFilterDto.limit)
            .skip((getFollowWithFilterDto.page - 1) * getFollowWithFilterDto.limit)
            .getManyAndCount();

        return [
            results[0].map(follow => {
                return {
                    ...follow,
                    story: {
                        ...follow.story,
                        coverImage: UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
                            url: follow.story.coverImage,
                            expireIn: 4 * 60 * 60,
                            iat: Date.now()
                        } as UrlCipherPayload))),
                        chapters: follow.story.chapters.map(chapter => {
                            return plainToInstance(ChapterInfoPublicDto, chapter);
                        })
                    }
                }
            }),
            results[1]
        ]
    }

    async deleteAll(userId: number) {
        await this.followRepository.delete({
            readerId: userId
        })
        return true;
    }
}