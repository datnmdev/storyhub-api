import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '@/database/entities/Country';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
	constructor(
		@InjectRepository(Country)
		private countryRepository: Repository<Country>,
	) {}

	async create(createCountryDto: CreateCountryDto): Promise<Country> {
		return await this.countryRepository.save(createCountryDto);
	}

	async findAll(): Promise<Country[]> {
		return await this.countryRepository.find();
	}

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}
