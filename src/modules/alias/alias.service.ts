import { Injectable } from '@nestjs/common';
import { CreateAliasDto } from './dto/create-alias.dto';
import { UpdateAliasDto } from './dto/update-alias.dto';
import { Repository } from 'typeorm';
import { Alias } from '@/database/entities/Alias';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AliasService {
	constructor(
		@InjectRepository(Alias)
		private aliasRepository: Repository<Alias>,
	) {}
	async create(createAliasDto: CreateAliasDto[]): Promise<Alias[]> {
		await this.removeByStoryId(createAliasDto[0].storyId);
		return await this.aliasRepository.save(createAliasDto);
	}

	async findAll(): Promise<Alias[]> {
		return await this.aliasRepository.find();
	}

	async removeByStoryId(storyId: number): Promise<string> {
		await this.aliasRepository.delete({ storyId });
		return `All aliases for story ID ${storyId} removed`;
	}
}
