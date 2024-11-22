import { Injectable } from '@nestjs/common';
import { CreateModerationRequestDto } from './dto/create-moderation-request.dto';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '@/database/entities/Account';
import { CustomNotFoundException } from '@/errors/error-codes.enum';

@Injectable()
export class ModerationRequestService {
  constructor(
    @InjectRepository(ModerationRequest)
    private readonly moderationReqRepository: Repository<ModerationRequest>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}
  async createModorationReq(
    createModerationRequestDto: CreateModerationRequestDto,
  ): Promise<ModerationRequest> {
    const moderatorAccount = await this.accountRepository.findOne({
      where: {
        status: 1,
        role: {
          name: 'moderator',
        },
      },
      relations: ['role'],
    });

    if (!moderatorAccount) {
      throw new Error('No active moderator account found.');
    }

    createModerationRequestDto.responserId = moderatorAccount.id;

    const newReq = this.moderationReqRepository.create(
      createModerationRequestDto,
    );
    return await this.moderationReqRepository.save(newReq);
  }

  findAll() {
    return `This action returns all moderationRequest`;
  }
  async update(id: number, status: number): Promise<String> {
    // Tìm moderation request cần cập nhật
    const req = await this.findOne(id);

    await this.moderationReqRepository.update({ id: id }, { status: status });

    return 'Update moderation request success!';
  }
  async findOne(id: number): Promise<ModerationRequest> {
    const req = await this.moderationReqRepository.findOne({
      where: { id },
    });
    if (!req) {
      throw new CustomNotFoundException('Moderation request not found!');
    }
    return req;
  }

  remove(id: number) {
    return `This action removes a #${id} moderationRequest`;
  }
}
