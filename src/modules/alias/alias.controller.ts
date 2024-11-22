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
    return this.aliasService.create(createAliasDto);
  }

  @Get()
  async findAll() {
    return this.aliasService.findAll();
  }

  @Put()
  async update(@Body() updateAliasDto: UpdateAliasDto[]) {
    return this.aliasService.update(updateAliasDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.aliasService.remove(+id);
  }
}
