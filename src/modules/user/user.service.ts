import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getProfile(accountId: number) {
		const profile = await this.userRepository.findOneBy({
			id: accountId,
		});
		return profile;
	}

	async create(userEntity: User) {
		return await this.userRepository.save(userEntity);
	}
}
