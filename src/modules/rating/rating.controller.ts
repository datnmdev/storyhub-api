import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { RatingService } from "./rating.service";
import { GetRatingCountDto } from "./dto/get-rating-count.dto";
import { GetRatingSummaryDto } from "./dto/get-rating-summary.dto";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { User } from "@/common/decorators/user.decorator";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/constants/account.constants";
import { RolesGuard } from "@/common/guards/roles.guard";
import { GetRatingDto } from "./dto/get-rating.dto";
import { GetTopRatingStoryDto } from "./dto/get-top-rating-story.dto";

@Controller("rating")
export class RatingController {
    constructor(
        private readonly ratingService: RatingService
    ) {}

    @Get()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    getRating(@User('userId') userId: number, @Query() getRatingDto: GetRatingDto) {
        return this.ratingService.getRating(userId, getRatingDto.storyId);
    }

    @Get("count")
    getRatingCount(@Query() getRatingCountDto: GetRatingCountDto) {
        return this.ratingService.getRatingCount(getRatingCountDto.storyId);
    }

    @Get('summary')
    getRatingSummary(@Query() getRatingDto: GetRatingSummaryDto) {
        return this.ratingService.getRatingSummary(getRatingDto.storyId);
    }

    @Post()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    createRating(@User('userId') userId: number, @Body() createRatingDto: CreateRatingDto) {
        return this.ratingService.create(userId, createRatingDto);
    }

    @Put()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    updateRating(@User('userId') userId: number, @Body() updateRatingDto: UpdateRatingDto) {
        return this.ratingService.update(userId, updateRatingDto);
    }

    @Get("get-top")
    getTopRatingStory(@Query() getTopRatingStoryDto: GetTopRatingStoryDto) {
        return this.ratingService.getTopRatingStory(getTopRatingStoryDto);
    }
}