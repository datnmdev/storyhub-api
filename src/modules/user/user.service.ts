import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import UrlResolverUtils from '@/common/utils/url-resolver.util';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly urlCipherService: UrlCipherService
	) { }

	async getProfile(userId: number): Promise<User> {
		const profile = await this.userRepository.findOneBy({
			id: userId,
		});
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

	async updateAvatar(userId: number, avatar: string) {
		await this.userRepository.update({ id: userId }, { avatar });
	} 
}
