import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigModule } from "@nestjs/config";

@Injectable()
export class ConfigService {
    constructor(
        private readonly nestConfigService: NestConfigModule
    ) { }

    getJwtConfig() {
        return {
            accessTokenConfig: {
                secret: this.nestConfigService.get('JWT_ACCESS_TOKEN_SECRET'),
                expiresIn: Number(this.nestConfigService.get('JWT_ACCESS_TOKEN_EXPIRE')),
            },
            refreshTokenConfig: {
                secret: this.nestConfigService.get('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: Number(this.nestConfigService.get('JWT_REFRESH_TOKEN_EXPIRE')),
            }
        }
    }

    getRedisConfig() {
        return {
            host: this.nestConfigService.get('REDIS_HOST'),
            port: Number(this.nestConfigService.get('REDIS_PORT')),
            password: this.nestConfigService.get('REDIS_PASSWORD')
        }
    }

    getMailerConfig() {
        return {
            host: this.nestConfigService.get('MAILER_HOST'),
            port: Number(this.nestConfigService.get('MAILER_PORT')),
            user: this.nestConfigService.get('MAILER_USER'),
            password: this.nestConfigService.get('MAILER_PASS')
        }
    }

    getWebsocketConfig() {
        return {
            port: Number(this.nestConfigService.get('PORT_WS'))
        }
    }

    getVnpConfig() {
        return {
            vnpTmnCode: this.nestConfigService.get('VNP_TMN_CODE'),
            vnpHashSecret: this.nestConfigService.get('VNP_HASH_SECRET'),
            vnpUrl: this.nestConfigService.get('VNP_URL'),
            vnpApi: this.nestConfigService.get('VNP_API'),
            vnpReturnUrl: this.nestConfigService.get('VNP_RETURN_URL')
        }
    }
}