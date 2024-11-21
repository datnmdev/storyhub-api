import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { RedisClient } from '../redis/redis.type';
import KeyGenerator from '../utils/generate-key.util';
import { JwtService } from '../jwt/jwt.service';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

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
			const isAccessTokenExpired = !(await this.redisClient.get(
				KeyGenerator.accessTokenKey(accessToken),
			));
			if (!isAccessTokenExpired) {
				req.user = this.jwtService.decode(accessToken);
				return next();
			}
		}

		return next(new UnauthorizedException());
	}
}
