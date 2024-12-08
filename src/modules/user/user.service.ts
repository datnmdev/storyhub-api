import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly urlCipherService: UrlCipherService
	) { }

	async getProfile(userId: number): Promise<User> {
		const profile = await this.findOneBy(userId);
		return {
			...profile,
			avatar: profile.avatar
				? UrlResolverUtils.createUrl('/url-resolver', this.urlCipherService.generate({
					url: profile.avatar,
					expireIn: 30 * 60 * 60,
					iat: Date.now()
				}))
				: profile.avatar
		};
	}

	async updateProfile(data: UpdateUserDto): Promise<User> {
		await this.userRepository.update({ id: data.id }, data);
		
		return this.getProfile(data.id);
	}

	findOneBy(userId: number) {
		return this.userRepository.findOneBy({
			id: userId,
		});
	}

	updateUser(userId: number, data: User) {
		return this.userRepository.update(userId, data);
	}
}
