import { Controller, Get, Query } from "@nestjs/common";
import { RatingService } from "./rating.service";
import { GetRatingCountDto } from "./dto/get-rating-count.dto";
import { GetRatingDto } from "./dto/get-rating.dto";

@Controller("rating")
export class RatingController {
    constructor(
        private readonly ratingService: RatingService
    ) {}

    @Get("count")
    getRatingCount(@Query() getRatingCountDto: GetRatingCountDto) {
        return this.ratingService.getRatingCount(getRatingCountDto.storyId);
    }

    @Get('summary')
    getRating(@Query() getRatingDto: GetRatingDto) {
        return this.ratingService.getRating(getRatingDto.storyId);
    }
}