import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Story } from "@/database/entities/Story";
import { plainToInstance } from "class-transformer";
import UrlResolverUtils from "@/common/utils/url-resolver.util";
import { UrlCipherPayload } from "@/common/url-cipher/url-cipher.class";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { ChapterInfoPublicDto } from "../chapter/dto/get-chapter-with-filter.dto";
import { History } from "./entities/reading-history.entity";
import { CreateReadingHistoryDto } from "./dto/create-reading-history.dto";
import { UpdateReadingHistoryDto } from "./dto/update-reading-history.dto";
import { GetReadingHistoryWithFilterDto } from "./dto/get-reading-history-with-filter.dto";

@Injectable()
export class ReadingHistoryService {
    constructor(
        @InjectRepository(History)
        private readonly readingHistoryRepository: Repository<History>,
        private readonly dataSource: DataSource,
        private readonly urlCipherService: UrlCipherService
    ) { }

    createReadingHistory(userId: number, createReadingHistoryDto: CreateReadingHistoryDto) {
        return this.readingHistoryRepository.save({
            position: createReadingHistoryDto.position,
            chapterId: createReadingHistoryDto.chapterId,
            readerId: userId
        })
    }

    updateReadingHistory(userId: number, updateReadingHistoryDto: UpdateReadingHistoryDto) {
        return this.readingHistoryRepository.update({
            readerId: userId,
            chapterId: updateReadingHistoryDto.chapterId
        }, {
            position: updateReadingHistoryDto.position
        })
    }

    deleteReadingHistoryByChapterId(userId: number, chapterId: number) {
        return this.readingHistoryRepository.delete({
            readerId: userId,
            chapterId
        })
    }

    deleteReadingHistoryByStoryId(userId: number, storyId: number) {
        return this.readingHistoryRepository
            .createQueryBuilder('history')
            .innerJoin('history.chapter', 'chapter')
            .where('history.reader_id = :readerId', {
                readerId: userId
            })
            .andWhere('chapter.storyId = :storyId', {
                storyId
            })
            .delete();
    }

    async getReadingHistoryWithFilter(userId: number, getReadingHistoryWithFilterDto: GetReadingHistoryWithFilterDto) {
        const result = await this.readingHistoryRepository
            .createQueryBuilder('history')
            .innerJoinAndSelect('history.chapter', 'chapter')
            .innerJoinAndSelect('chapter.story', 'story')
            .where('history.reader_id = :readerId', {
                readerId: userId
            })
            .take(getReadingHistoryWithFilterDto.limit)
            .skip((getReadingHistoryWithFilterDto.page - 1) * getReadingHistoryWithFilterDto.limit)
            .getManyAndCount();

        const filteredStories: Story[] = [];
        result[0].forEach(history => {
            if (filteredStories.every(story => history.chapter.storyId != story.id)) {
                filteredStories.push(history.chapter.story);
            }
        })
        
        return [
            filteredStories.map(story => {
                return {
                    ...story,
                    coverImage: UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
                        url: story.coverImage,
                        expireIn: 4 * 60 * 60,
                        iat: Date.now()
                    } as UrlCipherPayload))),
                    histories: result[0].filter(history => history.chapter.storyId === story.id)
                }
            }),
            result[1]
        ];
    }

    async deleteAll(userId: number) {
        await this.readingHistoryRepository.delete({
            readerId: userId
        })
        return true;
    }
}