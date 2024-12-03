import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '@/database/entities/Genre';
import { Brackets, Repository } from 'typeorm';
import { GetGenreWithFilterDto } from './dto/get-genre-with-filter.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) { }
  async create(createGenreDto: CreateGenreDto[]): Promise<Genre[]> {
    return await this.genreRepository.save(createGenreDto);
  }

  async findAll(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

  findOne(id: number) {
    return this.genreRepository.findOne({
      where: {
        id
      }
    });
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }

  // datnmptit
  getGenreWithFilter(getGenreWithFilterDto: GetGenreWithFilterDto) {
    const qb = this.genreRepository
      .createQueryBuilder("genre")
      .where(new Brackets(qb => {
        if (getGenreWithFilterDto.id) {
          qb.where("genre.id = :id", {
            id: getGenreWithFilterDto.id
          })
        }
      }))
      .andWhere(new Brackets(qb => {
        if (getGenreWithFilterDto.name) {
          qb.where("genre.name = :name", {
            name: getGenreWithFilterDto.name
          })
        }
      }))
    qb.take(getGenreWithFilterDto.limit)
    qb.skip((getGenreWithFilterDto.page - 1) * getGenreWithFilterDto.limit);
    return qb.getManyAndCount();
  }
}
