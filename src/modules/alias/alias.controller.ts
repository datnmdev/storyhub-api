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
import { AliasService } from './alias.service';
import { CreateAliasDto } from './dto/create-alias.dto';
import { UpdateAliasDto } from './dto/update-alias.dto';
import { Alias } from '@/database/entities/Alias';
import { GetAliasByStoryIdDto } from './dto/get-alias-by-story-id.dto';

@Controller('alias')
export class AliasController {
  constructor(private readonly aliasService: AliasService) {}

  @Post()
  async createAlias(@Body() createAliasDto: CreateAliasDto[]): Promise<Alias[]> {
    return await this.aliasService.create(createAliasDto);
  }

  @Get()
  async findAll(): Promise<Alias[]> {
    return await this.aliasService.findAll();
  }

  @Put()
  async update(@Body() updateAliasDto: UpdateAliasDto[]): Promise<Alias[]> {
    return await this.aliasService.update(updateAliasDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return await this.aliasService.remove(+id);
  }

  @Get('get-by-story-id')
  getAliasByStoryId(@Query() getAliasByStoryId: GetAliasByStoryIdDto) {
    return this.aliasService.getAliasByStoryId(getAliasByStoryId.storyId);
  }
}
