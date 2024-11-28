import { Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from '@/database/entities/Price';
import { Repository } from 'typeorm';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
  ) {}
  async create(createPriceDto: CreatePriceDto): Promise<Price> {
    return await this.priceRepository.save(createPriceDto);
  }

  async findAll(storyId: number): Promise<Price[]> {
    return await this.priceRepository.find({ where: { storyId } });
  }

  async findOne(id: number): Promise<Price> {
    const price = await this.priceRepository.findOne({ where: { id } });
    if (!price) {
      throw new Error(`Price with ID ${id} not found`);
    }
    return price;
  }

  async update(id: number, updatePriceDto: UpdatePriceDto): Promise<Price> {
    const price = await this.findOne(id);
    Object.assign(price, updatePriceDto);
    return await this.priceRepository.save(price);
  }

  async remove(id: number): Promise<string> {
    await this.priceRepository.delete(id);
    return `Price with ID ${id} removed`;
  }
}
