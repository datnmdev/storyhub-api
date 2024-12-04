import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
	Query,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from '@/database/entities/Story';
import { PaginateStoriesDTO } from '@/pagination/paginated-stories.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';
import { PriceService } from '../price/price.service';
import { AliasService } from '../alias/alias.service';
import { GetStoryWithFilterDto } from './dto/get-story-with-filter.dto';

@Controller('story')
export class StoryController {
	constructor(
		private readonly storyService: StoryService,
		private readonly priceService: PriceService,
		private readonly aliasService: AliasService,
	) {}

	@Post()
	async createStory(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
		const story = await this.storyService.create(createStoryDto);
		if (createStoryDto.price) {
			await this.priceService.create({
				amount: createStoryDto.price.amount,
				startTime: new Date(createStoryDto.price.startTime),
				storyId: story.id,
			});
		}
		if (createStoryDto.alias) {
			const resultArray = createStoryDto.alias.split(',').map((item) => {
				return {
					name: item.trim(),
					storyId: story.id,
				};
			});
			await this.aliasService.create(resultArray);
		}
		return story;
	}

	@Get()
	async findAllStory(
		@Query() paginationQuery: any,
	): Promise<IPaginatedType<Story>> {
		const paginationDto = new PaginateStoriesDTO();
		Object.assign(paginationDto, paginationQuery);
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

	// Nguyễn Minh Đạt
	@Get("all/filter")
	getStoryWithFilter(@Query() getStoryWithFilterDto: GetStoryWithFilterDto) {
		return this.storyService.getStoryWithFilter(getStoryWithFilterDto);
	}

	@Get("all/get-genres")
	getGenresOfStory(@Query('storyId') storyId: number) {
		return this.storyService.getGenres(storyId);
	}
}
