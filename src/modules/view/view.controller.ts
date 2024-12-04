import { Controller, Get, Param, Query } from "@nestjs/common";
import { ViewService } from "./view.service";
import { GetViewCountOfStoryDto } from "./dto/get-view-count-of-story.dto";
import { GetTopStoryDto } from "./dto/get-top-story.dto";
import { GetViewCountOfChapterDto } from "./dto/get-view-count-of-chapter.dto";

@Controller('view')
export class ViewController {
    constructor(
        private readonly viewService: ViewService
    ) {}

    @Get('count/story/:storyId')
    getViewCountOfStory(@Param() getViewCountOfStoryDto: GetViewCountOfStoryDto) {
        return this.viewService.getViewCountOfStory(getViewCountOfStoryDto.storyId);
    }

    @Get('count/chapter/:chapterId')
    getViewCountOfChapter(@Param() getViewCountOfChapterDto: GetViewCountOfChapterDto) {
        return this.viewService.getViewCountOfChapter(getViewCountOfChapterDto.chapterId);
    }

    @Get("get-top")
    getTopStory(@Query() getTopStoryDto: GetTopStoryDto) {
        return this.viewService.getTopStory(getTopStoryDto);
    }
}