import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { CommentType } from "@/common/constants/comment.constants";
import { GetCommentWithFilterDto } from "./dto/get-comment-with-filter.dto";
import { Comment } from "./entities/comment.entity";
import UrlResolverUtils from "@/common/utils/url-resolver.util";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { plainToInstance } from "class-transformer";
import { UrlCipherPayload } from "@/common/url-cipher/url-cipher.class";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly urlCipherService: UrlCipherService
    ) { }

    async getCommentWithFilter(getCommentWithFilterDto: GetCommentWithFilterDto) {
        const qb = this.commentRepository
            .createQueryBuilder('comment')
            .innerJoinAndSelect('comment.reader', 'reader')
            .innerJoinAndSelect('reader.user', 'user')
            .where(
                new Brackets((qb) => {
                    if (getCommentWithFilterDto.id) {
                        qb.where('comment.id = :id', {
                            id: getCommentWithFilterDto.id,
                        });
                    }
                }),
            )
            .andWhere(
                new Brackets((qb) => {
                    if (getCommentWithFilterDto.type) {
                        qb.where('comment.type = :type', {
                            type: getCommentWithFilterDto.type,
                        });
                    }
                }),
            )
            .andWhere(
                new Brackets((qb) => {
                    if (getCommentWithFilterDto.parentId) {
                        qb.where('comment.parentId = :parentId', {
                            parentId: getCommentWithFilterDto.parentId,
                        });
                    }
                }),
            )
            .andWhere(
                new Brackets((qb) => {
                    if (getCommentWithFilterDto.type === CommentType.FOR_STORY && getCommentWithFilterDto.storyId) {
                        qb.where('comment.storyId = :storyId', {
                            storyId: getCommentWithFilterDto.storyId,
                        });
                    }
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    if (getCommentWithFilterDto.type === CommentType.FOR_CHAPTER && getCommentWithFilterDto.chapterId) {
                        qb.where('comment.chapterId = :chapterId', {
                            chapterId: getCommentWithFilterDto.chapterId,
                        });
                    }
                }),
            )
            .andWhere(
                new Brackets((qb) => {
                    if (getCommentWithFilterDto.readerId) {
                        qb.where('comment.readerId = :readerId', {
                            readerId: getCommentWithFilterDto.readerId,
                        });
                    }
                }),
            );

        if (getCommentWithFilterDto.orderBy) {
            getCommentWithFilterDto.orderBy.forEach((value) => {
                qb.addOrderBy(`comment.${value[0]}`, value[1]);
            });
        }
        qb.take(getCommentWithFilterDto.limit);
        qb.skip((getCommentWithFilterDto.page - 1) * getCommentWithFilterDto.limit);
        const result = await qb.getManyAndCount();
        return [
            result[0].map(comment => {
                return {
                    ...comment,
                    reader: {
                        ...comment.reader,
                        user: {
                            ...comment.reader.user,
                            avatar: UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
                                url: comment.reader.user.avatar
                            } as UrlCipherPayload)))
                        }
                    }
                }
            }),
            result[1]
        ]
    }

    createComment(userId: number, createCommentDto: CreateCommentDto) {
        return this.commentRepository.save({
            type: createCommentDto.type,
            content: createCommentDto.content,
            parentId: createCommentDto.parentId,
            chapterId: createCommentDto.type === CommentType.FOR_CHAPTER ? createCommentDto.chapterId : null,
            storyId: createCommentDto.type === CommentType.FOR_STORY ? createCommentDto.storyId : null,
            readerId: userId
        })
    }

    updateComment(id: number, content: string) {
        return this.commentRepository.update(id, {
            content,
            updatedAt: new Date()
        })
    }

    deleteComment(id: number) {
        return this.commentRepository.delete({
            id
        })
    }
}