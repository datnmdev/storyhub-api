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
    return await this.aliasRepository.save(createAliasDto);
  }

  async findAll() {
    return `This action returns all alias`;
  }

  async update(updateAliasDto: UpdateAliasDto[]): Promise<Alias[]> {
    const updatedAliases = await Promise.all(
      updateAliasDto.map(async (aliasDto) => {
        const { id, ...updateData } = aliasDto;
        // Cập nhật alias theo id
        await this.aliasRepository.update(id, updateData);
        // Lấy lại alias đã cập nhật để trả về
        return await this.aliasRepository.findOne({ where: { id } });
      })
    );
  
    return updatedAliases.filter(alias => alias !== null); // Loại bỏ các giá trị null nếu không tìm thấy
  }
  
 
  async remove(id: number) {
    return `This action removes a #${id} alias`;
  }
}
