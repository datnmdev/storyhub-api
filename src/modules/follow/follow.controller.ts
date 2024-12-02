import { Controller, Get, Query } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { GetFollowerCountDto } from "./dto/get-follower-count.dto";

@Controller('follow')
export class FollowController {
    constructor(
        private readonly followService: FollowService
    ) {}

    @Get('count')
    getFollowerCount(@Query() getFollowerCountDto: GetFollowerCountDto) {
        return this.followService.getFollowerCount(getFollowerCountDto.storyId);
    }
}