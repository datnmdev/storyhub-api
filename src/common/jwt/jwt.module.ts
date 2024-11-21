import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import {
	JWT_ACCESS_TOKEN_CONFIG,
	JWT_REFRESH_TOKEN_CONFIG,
} from './jwt.constants';
import { jwtAccessTokenConfig, jwtRefreshTokenConfig } from './jwt.config';

@Global()
@Module({
	providers: [
		JwtService,
		{
			provide: JWT_ACCESS_TOKEN_CONFIG,
			useFactory: () => {
				return jwtAccessTokenConfig();
			},
		},
		{
			provide: JWT_REFRESH_TOKEN_CONFIG,
			useFactory: () => {
				return jwtRefreshTokenConfig();
			},
		},
	],
	exports: [JWT_ACCESS_TOKEN_CONFIG, JWT_REFRESH_TOKEN_CONFIG, JwtService],
})
export class JwtModule {}
