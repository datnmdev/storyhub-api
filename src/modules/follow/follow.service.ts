import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { FollowDetail } from "./entities/follow-detail.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(FollowDetail)
        private readonly followRepository: Repository<FollowDetail>
    ) {}

    getFollowerCount(storyId: number) {
        return this.followRepository
            .createQueryBuilder('follow_detail')
            .where("follow_detail.story_id = :storyId", {
                storyId
            })
            .getCount();
    }
}