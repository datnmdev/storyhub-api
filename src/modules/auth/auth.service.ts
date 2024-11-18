import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import { EmailPasswordCredential } from './entities/email-password-credential.entity';
import bcrypt from 'bcrypt';
import { JwtService } from '@/common/jwt/jwt.service';
import { plainToInstance } from 'class-transformer';
import { JwtAccessTokenConfig, JwtPayload, JwtRefreshTokenConfig } from '@/common/jwt/jwt.type';
import { REDIS_CLIENT } from '@/common/redis/redis.constants';
import { RedisClient } from '@/common/redis/redis.type';
import KeyGenerator from '@/common/utils/generate-key.util';
import { JWT_ACCESS_TOKEN_CONFIG, JWT_REFRESH_TOKEN_CONFIG } from '@/common/jwt/jwt.constants';
import { InvalidEmailPasswordException } from '@/common/exceptions/InvalidEmailPasswordException.exception';

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
        private readonly refreshTokenConfig: JwtRefreshTokenConfig
    ) { }

    async loginWithEmailPassword(emailPasswordCredentialDto: EmailPasswordCredentialDto) {
        try {
            // Kiểm tra tài khoản của địa chỉ email được yêu cầu đến có tồn tại hay không?
            const credential = await this.emailPasswordRepository.findOne({
                where: {
                    email: emailPasswordCredentialDto.email
                },
                relations: [
                    "account",
                    "account.role"
                ]
            })
            if (credential) {
                // Kiểm tra mật khẩu có khớp hay không?
                const checkPassword = await bcrypt.compare(emailPasswordCredentialDto.password, credential.password)
                if (checkPassword) {
                    const payload = plainToInstance(JwtPayload, {
                        accountId: credential.account.id,
                        role: credential.account.role.id,
                        status: credential.account.status
                    })

                    const newToken = this.jwtService.generateToken(payload)

                    // Ghi lại phiên đăng nhập vào redis
                    await this.redisClient
                        .multi()
                        .setEx(KeyGenerator.accessTokenKey(newToken.accessToken), this.accessTokenConfig.expiresIn, newToken.accessToken)
                        .setEx(KeyGenerator.refreshTokenKey(newToken.refreshToken), this.refreshTokenConfig.expiresIn, newToken.refreshToken)
                        .exec()

                    return newToken
                }
            }

            throw new InvalidEmailPasswordException()
        } catch (error) {
            throw error
        }
    }
}
