import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import { EmailPasswordCredential } from './entities/email-password-credential.entity';
import bcrypt from 'bcrypt';
import { JwtService } from '@/common/jwt/jwt.service';
import { plainToInstance } from 'class-transformer';
import {
	JwtAccessTokenConfig,
	JwtPayload,
	JwtRefreshTokenConfig,
} from '@/common/jwt/jwt.type';
import { REDIS_CLIENT } from '@/common/redis/redis.constants';
import { RedisClient } from '@/common/redis/redis.type';
import KeyGenerator from '@/common/utils/generate-key.util';
import {
	JWT_ACCESS_TOKEN_CONFIG,
	JWT_REFRESH_TOKEN_CONFIG,
} from '@/common/jwt/jwt.constants';
import { FailedSignInException } from '@/common/exceptions/failed-login.exception';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UnauthorizedException } from '@/common/exceptions/unauthorized.exception';
import { SignOutDto } from './dto/sign-out.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(EmailPasswordCredential)
		private readonly emailPasswordRepository: Repository<EmailPasswordCredential>,
		private readonly jwtService: JwtService,
		@Inject(REDIS_CLIENT)
		private readonly redisClient: RedisClient,
		@Inject(JWT_ACCESS_TOKEN_CONFIG)
		private readonly accessTokenConfig: JwtAccessTokenConfig,
		@Inject(JWT_REFRESH_TOKEN_CONFIG)
		private readonly refreshTokenConfig: JwtRefreshTokenConfig,
	) { }

	async loginWithEmailPassword(
		emailPasswordCredentialDto: EmailPasswordCredentialDto,
	) {
		// Kiểm tra tài khoản của địa chỉ email được yêu cầu đến có tồn tại hay không?
		const credential = await this.emailPasswordRepository.findOne({
			where: {
				email: emailPasswordCredentialDto.email,
			},
			relations: ['account', 'account.role'],
		});
		if (credential) {
			// Kiểm tra mật khẩu có khớp hay không?
			const checkPassword = await bcrypt.compare(
				emailPasswordCredentialDto.password,
				credential.password,
			);
			if (checkPassword) {
				const payload = plainToInstance(JwtPayload, {
					accountId: credential.account.id,
					role: credential.account.role.id,
					status: credential.account.status,
				});

				const newToken = this.jwtService.generateToken(payload);

				// Ghi lại phiên đăng nhập vào redis
				await this.redisClient
					.multi()
					.setEx(
						KeyGenerator.accessTokenKey(newToken.accessToken),
						this.accessTokenConfig.expiresIn,
						newToken.accessToken,
					)
					.setEx(
						KeyGenerator.refreshTokenKey(newToken.refreshToken),
						this.refreshTokenConfig.expiresIn,
						newToken.refreshToken,
					)
					.exec();

				return newToken;
			}
		}

		throw new FailedSignInException();
	}

	async validateToken(authorization: string) {
		if (authorization) {
			if (authorization.startsWith("Bearer")) {
				const split = authorization.split(" ");
				if (split.length == 2) {
					const isAccessTokenExpired = !(await this.redisClient.get(
						KeyGenerator.accessTokenKey(split[1]),
					));
					if (!isAccessTokenExpired) {
						return true;
					}
				}
			}
		}

		throw new UnauthorizedException();
	}

	async refreshToken(refreshTokenDto: RefreshTokenDto) {
		const isRefreshTokenExpired = !(await this.redisClient.get(
			KeyGenerator.refreshTokenKey(refreshTokenDto.refreshToken),
		));
		if (!isRefreshTokenExpired) {
			const payload: JwtPayload = {
				...this.jwtService.decode(
					refreshTokenDto.refreshToken,
				),
				iat: Date.now()
			};
			const refreshTokenExpireIn =
				Math.ceil(payload.iat / 1000) +
				this.refreshTokenConfig.expiresIn -
				Math.floor(Date.now() / 1000);
			const newToken = this.jwtService.generateToken(payload);

			// Xoá token cũ và ghi lại phiên đăng nhập mới vào redis
			await this.redisClient
				.multi()
				.del(KeyGenerator.accessTokenKey(refreshTokenDto.accessToken))
				.del(KeyGenerator.refreshTokenKey(refreshTokenDto.refreshToken))
				.setEx(
					KeyGenerator.accessTokenKey(newToken.accessToken),
					this.accessTokenConfig.expiresIn,
					newToken.accessToken,
				)
				.setEx(
					KeyGenerator.refreshTokenKey(newToken.refreshToken),
					refreshTokenExpireIn,
					newToken.refreshToken,
				)
				.exec();

			return newToken;
		}

		throw new UnauthorizedException();
	}

	async signOut(signOutDto: SignOutDto) {
		try {
			await this.redisClient
				.multi()
				.del(KeyGenerator.accessTokenKey(signOutDto.accessToken))
				.del(KeyGenerator.refreshTokenKey(signOutDto.refreshToken))
				.exec();
			return true;
		} catch (error) {
			return false;
		}
	}
}
