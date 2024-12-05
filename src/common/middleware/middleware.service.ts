import { ForbiddenException, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { RedisClient } from '../redis/redis.type';
import KeyGenerator from '../utils/generate-key.util';
import { JwtService } from '../jwt/jwt.service';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { AccountStatus, Role } from '../constants/account.constants';
import { UrlCipherService } from '../url-cipher/url-cipher.service';
import { plainToInstance } from 'class-transformer';
import { EncryptedUrl } from '../url-cipher/url-cipher.class';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
	constructor(
		@Inject(REDIS_CLIENT)
		private readonly redisClient: RedisClient,
		private readonly jwtService: JwtService,
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const authorization = req.headers['authorization'];
		if (authorization?.startsWith('Bearer ')) {
			const accessToken = authorization.split('Bearer ')[1];
			const payload = this.jwtService.decode(accessToken);
			if (payload.role === Role.GUEST) {
				req.user = payload
				return next();
			} else {
				const isAccessTokenExpired = !(await this.redisClient.get(
					KeyGenerator.accessTokenKey(accessToken),
				));
				if (!isAccessTokenExpired) {
					if (payload.status === AccountStatus.ACTIVATED) {
						req.user = payload;
						return next();
					}
				}
			}
		}

		return next(new UnauthorizedException());
	}
}

@Injectable()
export class VerifyUrlValidityMiddleware implements NestMiddleware {
	constructor(
		private readonly urlCipherService: UrlCipherService
	) {}
	async use(req: Request, res: Response, next: NextFunction) {
		const encryptedUrl: EncryptedUrl = plainToInstance(EncryptedUrl, req.query);
		if (this.urlCipherService.verify(encryptedUrl)) {
			return next();
		}
		return next(new ForbiddenException())
	}
}