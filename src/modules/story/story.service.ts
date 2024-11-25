import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from '@/database/entities/Story';
import { Genre } from '@/database/entities/Genre';
import { PaginateDTO } from '@/pagination/create-paginated.dto';
import { IPaginatedType } from '@/pagination/paginated.decorator';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}
  async create(createStoryDto: CreateStoryDto): Promise<Story> {
    const genres = await this.genreRepository.findByIds(createStoryDto.genres || []);
    const newStory = this.storyRepository.create({ ...createStoryDto, genres });
    return await this.storyRepository.save(newStory);
  }

  async findAll(query: PaginateDTO): Promise<IPaginatedType<Story>> {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const keyword = query.keyword?.trim() || '';

    // Điều kiện tìm kiếm
    const whereCondition = {
      status: Not(6), // Trạng thái không được bằng 6
      ...(keyword ? { title: Like(`%${keyword}%`) } : {}),
    };

    const [result, totalCount] = await this.storyRepository.findAndCount({
      where: whereCondition,
      order: { title: 'DESC' },
      take: take,
      skip: skip,
      select: [
        'id',
        'title',
        'description',
        'note',
        'coverImage',
        'type',
        'status',
        'createdAt',
        'updatedAt',
      ],
      relations: ['aliases', 'country', 'author.user'],
    });

    // Tính toán các thông tin phân trang
    const totalPages = Math.ceil(totalCount / take);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const startCursor = result.length > 0 ? result[0].id.toString() : null;
    const endCursor =
      result.length > 0 ? result[result.length - 1].id.toString() : null;

    const edges = result.map((story) => ({
      cursor: story.id,
      node: story,
    }));
    // Trả về định dạng IPaginatedType<Story>
    return {
      edges,
      totalCount,
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    };
  }

  async findOne(id: number): Promise<Story> {
    const story = await this.storyRepository.findOne({
      where: { id },
      relations: ['aliases', 'genres', 'country', 'author.user'],
    });
    if (!story) {
      throw new Error(`Story with ID ${id} not found`);
    }
    return story;
  }

  async update(updateStoryDto: UpdateStoryDto): Promise<Story> {
    // Tìm Story cần cập nhật
    const story = await this.findOne(updateStoryDto.id);

    Object.assign(story, updateStoryDto);
    await this.storyRepository.save(story);

    return story;
  }

  // Hàm xóa story
  async remove(id: number): Promise<string> {
    // Tìm story theo ID
    const story = await this.findOne(id);

    // Cập nhật trạng thái story
    await this.storyRepository.update({ id: id }, { status: 6 });

    return `This action removes a #${id} story`;
  }
}
