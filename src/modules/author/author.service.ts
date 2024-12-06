import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Author } from "./entities/author.entity";
import { Repository } from "typeorm";
import UrlResolverUtils from "@/common/utils/url-resolver.util";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { plainToInstance } from "class-transformer";
import { UrlCipherPayload } from "@/common/url-cipher/url-cipher.class";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private readonly authorRepository: Repository<Author>,
        private readonly urlCipherService: UrlCipherService
    ) { }

    async getSomeAuthorInfo(id: number) {
        const author = await this.authorRepository.findOne({
            where: {
                id
            },
            relations: [
                "user"
            ]
        })
        if (author) {
            return {
                id: author.user.id,
                name: author.user.name,
                dob: author.user.dob,
                gender: author.user.gender,
                avatar: author.user.avatar
                    ? UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate(plainToInstance(UrlCipherPayload, {
                        url: author.user.avatar,
                        expireIn: 4 * 60 * 60,
                        iat: Date.now()
                    } as UrlCipherPayload)))
                    : author.user.avatar
            }
        }
        return null;
    }

    getAll() {
        return this.authorRepository.find({
            relations: [
                "user"
            ]
        })
    }
}