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

	async getProfile(userId: number) {
		const profile = await this.userRepository.findOneBy({
			id: userId,
		});
		return profile;
	}

	async updateAvatar(userId: number, avatar: string) {
		await this.userRepository.update({ id: userId }, { avatar });
	} 
}
