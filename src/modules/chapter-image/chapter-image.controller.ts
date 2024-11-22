import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChapterImageService } from './chapter-image.service';
import { CreateChapterImageDto } from './dto/create-chapter-image.dto';
import { UpdateChapterImageDto } from './dto/update-chapter-image.dto';
import { ChapterImage } from '@/database/entities/ChapterImage';

@Controller('chapter-image')
export class ChapterImageController {
  constructor(private readonly chapterImageService: ChapterImageService) {}

  @Post()
  async create(
    @Body() createChapterImageDto: CreateChapterImageDto,
  ): Promise<ChapterImage> {
    return await this.chapterImageService.create(createChapterImageDto);
  }

  @Get()
  async findAll(): Promise<ChapterImage[]> {
    return await this.chapterImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapterImageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChapterImageDto: UpdateChapterImageDto,
  ) {
    return this.chapterImageService.update(+id, updateChapterImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapterImageService.remove(+id);
  }
}
