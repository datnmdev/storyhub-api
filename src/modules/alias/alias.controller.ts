import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AliasService } from './alias.service';
import { CreateAliasDto } from './dto/create-alias.dto';
import { UpdateAliasDto } from './dto/update-alias.dto';
import { Alias } from '@/database/entities/Alias';

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
}
