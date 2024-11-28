import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Put,
  Query,
} from '@nestjs/common';
import { ChapterImageService } from './chapter-image.service';
import { CreateChapterImageDto } from './dto/create-chapter-image.dto';
import { UpdateChapterImageDto } from './dto/update-chapter-image.dto';
import { ChapterImage } from '@/database/entities/ChapterImage';

@Controller('chapter-image')
export class ChapterImageController {
	constructor(private readonly chapterImageService: ChapterImageService) {}

	@Post()
	async createChapterImage(
		@Body() createChapterImageDto: CreateChapterImageDto[],
	): Promise<ChapterImage[]> {
		return await this.chapterImageService.create(createChapterImageDto);
	}

	@Get('all')
	async findAll(
		@Query('chapterId') chapterId: string,
	): Promise<ChapterImage[]> {
		console.log(chapterId);
		return await this.chapterImageService.findAll(chapterId);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<ChapterImage> {
		return await this.chapterImageService.findOne(+id);
	}

	@Put(':id')
	async update(
		@Body() updateChapterImageDto: UpdateChapterImageDto[],
	): Promise<ChapterImage[]> {
		return await this.chapterImageService.update(updateChapterImageDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<string> {
		return await this.chapterImageService.remove(+id);
	}
}
