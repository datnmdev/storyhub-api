import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInWithEmailPasswordDto } from './dto/sign-in-with-email-password.dto';
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
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UnauthorizedException } from '@/common/exceptions/unauthorized.exception';
import { SignOutDto } from './dto/sign-out.dto';
import { v6 as uuidV6 } from 'uuid';
import { OAuthStatus } from '@/common/constants/oauth.constants';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Account } from './entities/account.entity';
import { GoogleCredential } from './entities/google-credential.entity';
import { AccountStatus, AuthType, Role } from '@/common/constants/account.constants';
import { OAuthState } from '@/common/types/auth.type';
import FileLoaderUtils from '@/common/utils/file-loader.util';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(EmailPasswordCredential)
		private readonly emailPasswordRepository: Repository<EmailPasswordCredential>,
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>,
		@InjectRepository(GoogleCredential)
		private readonly googleCredentialRepository: Repository<GoogleCredential>,
		private readonly jwtService: JwtService,
		@Inject(REDIS_CLIENT)
		private readonly redisClient: RedisClient,
		@Inject(JWT_ACCESS_TOKEN_CONFIG)
		private readonly accessTokenConfig: JwtAccessTokenConfig,
		@Inject(JWT_REFRESH_TOKEN_CONFIG)
		private readonly refreshTokenConfig: JwtRefreshTokenConfig,
		private readonly userService: UserService
	) { }

	async signInWithEmailPassword(
		signInWithEmailPasswordDto: SignInWithEmailPasswordDto,
	) {
		// Kiểm tra tài khoản của địa chỉ email được yêu cầu đến có tồn tại hay không?
		const credential = await this.emailPasswordRepository.findOne({
			where: {
				email: signInWithEmailPasswordDto.email,
			},
			relations: ['account'],
		});
		if (credential) {
			// Kiểm tra mật khẩu có khớp hay không?
			const checkPassword = await bcrypt.compare(
				signInWithEmailPasswordDto.password,
				credential.password,
			);
			if (checkPassword) {
				const payload = plainToInstance(JwtPayload, {
					accountId: credential.account.id,
					role: credential.account.roleId,
					status: credential.account.status,
					iat: Date.now()
				} as JwtPayload);

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

	async signInWithGoogle() {
		const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
		const state = uuidV6();
		const params = new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID,
			redirect_uri: process.env.GOOGLE_REDIRECT_URI,
			response_type: 'code',
			scope: 'profile email',
			access_type: 'offline',
			state
		});
		// Quá trình xác thực và uỷ quyền chỉ duy trì trong 5 phút
		const oAuthState: OAuthState = {
			status: OAuthStatus.PENDING,
			token: null
		}
		await this.redisClient.setEx(KeyGenerator.googleOauthStateKey(state), 5 * 60, JSON.stringify(oAuthState));
		return `${googleAuthUrl}?${params.toString()}`;
	}

	async signInWithGoogleCallback(query: ParameterDecorator) {
		const { code, state } = query as any;
		const queryRunner = this.googleCredentialRepository.manager.connection.createQueryRunner();
		try {
			// Kiểm tra quá trình xác thực và uỷ quyền còn có hiệu lực không
			const isStateExpired = (JSON.parse(await this.redisClient.get(KeyGenerator.googleOauthStateKey(state))) as OAuthState).status != OAuthStatus.PENDING;
			if (!isStateExpired && code) {
				const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
					code,
					client_id: process.env.GOOGLE_CLIENT_ID,
					client_secret: process.env.GOOGLE_CLIENT_SECRET,
					redirect_uri: process.env.GOOGLE_REDIRECT_URI,
					grant_type: 'authorization_code',
				});
				const { access_token } = tokenResponse.data as any;
				const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
					headers: { Authorization: `Bearer ${access_token}` },
				});
				const userInfo = userInfoResponse.data as any;
				let payload: JwtPayload;

				// Kiểm tra và tạo tài khoản mới nêú chưa có
				const googleCredential = await this.googleCredentialRepository.findOne({
					where: {
						uid: userInfo.id
					},
					relations: [
						"account"
					]
				})
				if (!googleCredential) {
					// Bắt đầu transaction
					await queryRunner.startTransaction();

					// Tạo và lưu user mới
					const userEntity = plainToInstance(User, {
						name: userInfo.name,
						avatar: userInfo?.picture
					} as User)
					const newUser = await this.userService.create(userEntity);

					// Tạo và lưu tài khoản mới cho user
					const accountEntity = plainToInstance(Account, {
						id: newUser.id,
						createdAt: newUser.createdAt,
						roleId: Role.READER,
						status: AccountStatus.ACTIVATED,
						authType: AuthType.GOOGLE
					} as Account)
					const newAccount = await this.accountRepository.save(accountEntity);

					// Tạo và lưu google credential mới cho tài khoản
					const googleCredentialEntity = plainToInstance(GoogleCredential, {
						id: newAccount.id,
						uid: userInfo.id
					} as GoogleCredential)
					await this.googleCredentialRepository.save(googleCredentialEntity);

					// Thực hiện commit transaction
					await queryRunner.commitTransaction();

					// Tạo token mới
					payload = plainToInstance(JwtPayload, {
						accountId: newAccount.id,
						status: newAccount.status,
						role: newAccount.roleId,
						iat: Date.now()
					} as JwtPayload)
				}

				// Tạo token mới
				payload = plainToInstance(JwtPayload, {
					accountId: googleCredential.id,
					status: googleCredential.account.status,
					role: googleCredential.account.roleId,
					iat: Date.now()
				} as JwtPayload)
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

				const oAuthState: OAuthState = {
					status: OAuthStatus.SUCCEED,
					token: newToken
				}
				await this.redisClient.set(KeyGenerator.googleOauthStateKey(state), JSON.stringify(oAuthState), { KEEPTTL: true });
			} else {
				const oAuthState: OAuthState = {
					status: OAuthStatus.FAILED,
					token: null
				}
				await this.redisClient.set(KeyGenerator.googleOauthStateKey(state), JSON.stringify(oAuthState), { KEEPTTL: true });
			}
		} catch (error) {
			console.log(error);
			// Thực hiện rollback transaction
			await queryRunner.rollbackTransaction();

			const oAuthState: OAuthState = {
				status: OAuthStatus.FAILED,
				token: null
			}
			await this.redisClient.set(KeyGenerator.googleOauthStateKey(state), JSON.stringify(oAuthState), { KEEPTTL: true });
		} finally {
			return await FileLoaderUtils.loadHtmlFile('waiting-auth.html');
		}
	}

	async getTokenAfterOAuth(state: string) {
		return JSON.parse(await this.redisClient.get(KeyGenerator.googleOauthStateKey(state))) as OAuthState
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
