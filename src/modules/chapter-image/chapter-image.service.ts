import { Injectable } from '@nestjs/common';
import { CreateChapterImageDto } from './dto/create-chapter-image.dto';
import { UpdateChapterImageDto } from './dto/update-chapter-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterImage } from '@/database/entities/ChapterImage';
import { Repository } from 'typeorm';

@Injectable()
export class ChapterImageService {
  constructor(
    @InjectRepository(ChapterImage)
    private readonly chapterImageRepository: Repository<ChapterImage>,
  ) {}

  async create(
    createChapterImageDto: CreateChapterImageDto,
  ): Promise<ChapterImage> {
    return await this.chapterImageRepository.save(createChapterImageDto);
  }

  async findAll(): Promise<ChapterImage[]> {
    return await this.chapterImageRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} chapterImage`;
  }

  update(id: number, updateChapterImageDto: UpdateChapterImageDto) {
    return `This action updates a #${id} chapterImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} chapterImage`;
  }
}
