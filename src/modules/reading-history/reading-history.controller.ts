import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { User } from "@/common/decorators/user.decorator";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/constants/account.constants";
import { RolesGuard } from "@/common/guards/roles.guard";
import { ReadingHistoryService } from "./reading-history.service";
import { CreateReadingHistoryDto } from "./dto/create-reading-history.dto";
import { UpdateReadingHistoryDto } from "./dto/update-reading-history.dto";
import { DeleteReadingHistoryByChapterIdDto } from "./dto/delete-reading-history-by-chapter-id.dto";
import { DeleteReadingHistoryByStoryIdDto } from "./dto/delete-reading-history-by-story-id.dto";
import { GetReadingHistoryWithFilterDto } from "./dto/get-reading-history-with-filter.dto";

@Controller('reading-history')
export class ReadingHistoryController {
    constructor(
        private readonly readingHistoryService: ReadingHistoryService
    ) {}

    @Post()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    createReadingHistory(@User('userId') userId: number, @Body() createReadingHistoryDto: CreateReadingHistoryDto) {
        return this.readingHistoryService.createReadingHistory(userId, createReadingHistoryDto);
    }

    @Put()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    updateReadingHistory(@User('userId') userId: number, @Body() updateReadingHistoryDto: UpdateReadingHistoryDto) {
        return this.readingHistoryService.updateReadingHistory(userId, updateReadingHistoryDto);
    }

    @Delete('delete-by-chapter-id')
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    deleteReadingHistoryByChapterId(@User('userId') userId: number, @Query() deleteReadingHistoryByChapterIdDto: DeleteReadingHistoryByChapterIdDto) {
        return this.readingHistoryService.deleteReadingHistoryByChapterId(userId, deleteReadingHistoryByChapterIdDto.chapterId);
    }

    @Delete('delete-by-story-id')
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    deleteReadingHistoryByStoryId(@User('userId') userId: number, @Query() deleteReadingHistoryByStoryIdDto: DeleteReadingHistoryByStoryIdDto) {
        return this.readingHistoryService.deleteReadingHistoryByStoryId(userId, deleteReadingHistoryByStoryIdDto.storyId);
    }

    @Get('filter')
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    getReadingHistoryWithFilter(@User('userId') userId: number, @Query() getReadingHistoryWithFilterDto: GetReadingHistoryWithFilterDto) {
        return this.readingHistoryService.getReadingHistoryWithFilter(userId, getReadingHistoryWithFilterDto);
    }

    @Delete('all')
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    deleteAllReadingHistory(@User('userId') userId: number) {
        return this.readingHistoryService.deleteAll(userId);
    }
}