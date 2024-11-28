import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from '@/database/entities/Country';

@Controller('country')
export class CountryController {
	constructor(private readonly countryService: CountryService) {}

	@Post()
	async create(@Body() createCountryDto: CreateCountryDto): Promise<Country> {
		return await this.countryService.create(createCountryDto);
	}

	@Get()
	async findAll(): Promise<Country[]> {
		return await this.countryService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.countryService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateCountryDto: UpdateCountryDto,
	) {
		return this.countryService.update(+id, updateCountryDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.countryService.remove(+id);
	}
}
