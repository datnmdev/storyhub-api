import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { GetFollowerCountDto } from "./dto/get-follower-count.dto";
import { User } from "@/common/decorators/user.decorator";
import { GetFollowDto } from "./dto/get-follow.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/constants/account.constants";
import { RolesGuard } from "@/common/guards/roles.guard";
import { FollowDto } from "./dto/follow.dto";
import { UnfollowDto } from "./dto/unfollow.dto";
import { GetTopFollowStoryDto } from "./dto/get-top-follow-story.dto";

@Controller('follow')
export class FollowController {
    constructor(
        private readonly followService: FollowService
    ) {}

    @Get('count')
    getFollowerCount(@Query() getFollowerCountDto: GetFollowerCountDto) {
        return this.followService.getFollowerCount(getFollowerCountDto.storyId);
    }

    @Get()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    getFollow(@User('userId') userId: number, @Query() getFollowDto: GetFollowDto) {
        return this.followService.getFollow(userId, getFollowDto.storyId);
    }

    @Post()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    follow(@User('userId') userId: number, @Body() followDto: FollowDto) {
        return this.followService.follow(userId, followDto.storyId);
    }

    @Delete()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    unfollow(@User('userId') userId: number, @Query() unfollowDto: UnfollowDto) {
        return this.followService.unfollow(userId, unfollowDto.storyId);
    }

    @Get("get-top")
    getTopFollowStory(@Query() getTopFollowStoryDto: GetTopFollowStoryDto) {
        return this.followService.getTopFollowStory(getTopFollowStoryDto);
    }
}