import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import UrlResolverUtils from '@/common/utils/url-resolver.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileInfoDto } from './dto/update-profile-info.dto';
import { UrlPrefix } from '@/common/constants/url-resolver.constants';

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
		return this.userRepository.findOne({
			where: {
				id: userId
			},
			relations: [
				"account"
			]
		});
	}

	updateUser(userId: number, data: User) {
		return this.userRepository.update(userId, data);
	}

	async updateProfileInfo(userId: number, updateProfileInfoDto: UpdateProfileInfoDto) {
		if (updateProfileInfoDto.avatar) {
			updateProfileInfoDto.avatar = UrlPrefix.INTERNAL_AWS_S3.concat(updateProfileInfoDto.avatar);
		}
		const data = Object.fromEntries(
			Object.entries(updateProfileInfoDto).filter(([_, value]) => value !== undefined)
		);
		if (Object.keys(data).length > 0) {
			const result = await this.userRepository.update(userId, data);
			if (result.affected > 0) {
				return true;
			}
		}
		return false;
	}
}
