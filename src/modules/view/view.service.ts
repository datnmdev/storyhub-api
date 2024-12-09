import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { View } from "./entities/view.entity";
import { DataSource, Repository } from "typeorm";
import { GetTopStoryDto } from "./dto/get-top-story.dto";
import { Story } from "@/database/entities/Story";
import UrlResolverUtils from "@/common/utils/url-resolver.util";
import { plainToInstance } from "class-transformer";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { UrlCipherPayload } from "@/common/url-cipher/url-cipher.class";

@Injectable()
export class ViewService {
    constructor(
        @InjectRepository(View)
        private readonly viewRepository: Repository<View>,
        private readonly dataSource: DataSource,
        private readonly urlCipherService: UrlCipherService
    ) { }

    getViewCountOfStory(storyId: number) {
        return this.viewRepository
            .createQueryBuilder('view')
            .innerJoin('view.chapter', 'chapter')
            .innerJoin('chapter.story', 'story')
            .where("story.id = :storyId", {
                storyId
            })
            .getCount();
    }

    getViewCountOfChapter(chapterId: number) {
        return this.viewRepository
            .createQueryBuilder('view')
            .where("view.chapter_id = :chapterId", {
                chapterId
            })
            .getCount();
    }

    async getTopStory(getTopStoryDto: GetTopStoryDto) {
        const [result] = await this.dataSource.query(
            `CALL getTopViewedStories(?, ?)`,
            [
                getTopStoryDto.page,
                getTopStoryDto.limit
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
                    viewCount: Number(row.viewCount)
                }
            }),
            await this.dataSource
                .createQueryBuilder(Story, 'story')
                .getCount()
        ]
    }

    getViewCountOfStoryAt(storyId: number, atTime: number) {
        return this.viewRepository
            .createQueryBuilder('view')
            .innerJoin('view.chapter', 'chapter')
            .innerJoin('chapter.story', 'story')
            .where("story.id = :storyId", {
                storyId
            })
            .andWhere('view.created_at <= :atTime', {
                atTime: new Date(atTime)
            })
            .getCount();
    }

    async getTopViewChartData(atTime: number) {
        const [result] = await this.dataSource.query(
            `CALL getTopViewedStories(?, ?)`,
            [1, 3]
        );
        const stories: Story[] = [];
        for (let row of result) {
            const story = await this.dataSource
                .createQueryBuilder(Story, 'story')
                .innerJoinAndSelect('story.genres', 'genres')
                .innerJoinAndSelect('story.author', 'author')
                .innerJoinAndSelect('author.user', 'user')
                .innerJoinAndSelect('story.country', 'country')
                .where(`story.id = ${row.id}`)
                .getOne();
            stories.push(story);
        }

        // Tính tổng lượt xem tại mỗi thời điểm của bộ truyện
        const viewData: Array<number[]> = stories.map(() => []);
        const stopPoint = atTime - 3600000 * 23;
        while (atTime >= stopPoint) {
            for (let i = 0; i < stories.length; i++) {
                viewData[i].push(await this.getViewCountOfStoryAt(stories[i].id, atTime));
            }
            atTime -= 3600000;
        }

        // Tính tỉ lệ lượt xem giữa 3 bộ truyện tai mỗi thời điểm (phản ánh mức độ biến động của lượt xem tại mỗi thời điểm)
        let chartData = viewData
            .map((views, viewsIndex) => {
                return views.map((view, viewIndex) => {
                    const total = viewData[0][viewIndex] + viewData[1][viewIndex] + viewData[2][viewIndex];
                    if (total === 0) {
                        return 0;
                    }
                    return Math.ceil((view / total) * 100000000) / 100000000;
                })
            })

        chartData = chartData
            .map((views, viewsIndex) => {
                if (viewsIndex === 2) {
                    return views.map((view, viewIndex) => {
                        const total = chartData[0][viewIndex] + chartData[1][viewIndex] + chartData[2][viewIndex];
                        if (total === 0) {
                            return 0;
                        }
                        return 1 - chartData[0][viewIndex] - chartData[1][viewIndex];
                    })
                }
                return views;
            })

        return stories.map((story, index) => ({
            ...story,
            coverImage: UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
                url: story.coverImage,
                expireIn: 4 * 60 * 60,
                iat: Date.now()
            } as UrlCipherPayload))),
            chartData: chartData[index].reverse()
        }))
    }
}