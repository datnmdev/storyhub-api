import { Controller, Get, Param, Query } from "@nestjs/common";
import { ViewService } from "./view.service";
import { getViewCountOfStoryDto } from "./dto/get-view-count-of-story.dto";
import { GetTopStoryDto } from "./dto/get-top-story.dto";

@Controller('view')
export class ViewController {
    constructor(
        private readonly viewService: ViewService
    ) {}

    @Get('count/story/:storyId')
    getViewCountOfStory(@Param() getViewCountOfStoryDto: getViewCountOfStoryDto) {
        return this.viewService.getViewCountOfStory(getViewCountOfStoryDto.storyId);
    }

    @Get("get-top")
    getTopStory(@Query() getTopStoryDto: GetTopStoryDto) {
        return this.viewService.getTopStory(getTopStoryDto);
    }
}