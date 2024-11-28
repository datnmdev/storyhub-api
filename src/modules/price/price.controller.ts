import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Price } from '@/database/entities/Price';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  async create(@Body() createPriceDto: CreatePriceDto): Promise<Price> {
    return await this.priceService.create(createPriceDto);
  }

  @Get()
  async findAll(@Query('storyId') storyId: number): Promise<Price[]> {
    return await this.priceService.findAll(storyId);
  }

  @Get(':id')
  async   findOne(@Param('id') id: string): Promise<Price> {
    return await this.priceService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto): Promise<Price> {
    return await this.priceService.update(+id, updatePriceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return await this.priceService.remove(+id);
  }
}
