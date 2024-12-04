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
        return [
            result.map(row => {
                return plainToInstance(Story, {
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
                    authorId: row.author_id
                } as Story)
            }),
            await this.dataSource
                .createQueryBuilder(Story, 'story')
                .getCount()
        ]
    }
}