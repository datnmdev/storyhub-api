import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from '@/database/entities/Genre';
import { GetGenreWithFilterDto } from './dto/get-genre-with-filter.dto';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto[]): Promise<Genre[]> {
    return await this.genreService.create(createGenreDto);
	}

	@Get()
	async findAll(): Promise<Genre[]> {
		return await this.genreService.findAll();
	}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genreService.remove(+id);
  }

  @Get('all/filter')
  getGenreWithFilter(@Query() getGenreWithFilterDto: GetGenreWithFilterDto) {
    return this.genreService.getGenreWithFilter(getGenreWithFilterDto);
  }
}
