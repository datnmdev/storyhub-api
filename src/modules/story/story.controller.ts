import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from '@/database/entities/Story';
import { PaginateStoriesDTO } from '@/pagination/paginated-stories.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';

@Controller('story')
export class StoryController {
	constructor(private readonly storyService: StoryService) {}

	@Post()
	async createStory(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
		return await this.storyService.create(createStoryDto);
	}

	@Get()
	async findAllStory(
		@Body() paginationDto: PaginateStoriesDTO,
	): Promise<IPaginatedType<Story>> {
		return this.storyService.findAll(paginationDto);
	}

	@Get(':id')
	async findOneStory(@Param('id') id: number): Promise<Story> {
		return this.storyService.findOne(id);
	}

	@Put()
	async updateStory(@Body() updateStoryDto: UpdateStoryDto) {
		return this.storyService.update(updateStoryDto);
	}

	@Delete(':id')
	async removeStory(@Param('id') id: number) {
		return this.storyService.remove(id);
	}
}
