import { Inject, Injectable } from '@nestjs/common';
import { JwtAccessTokenConfig, JwtPayload, JwtRefreshTokenConfig, Token } from './jwt.type';
import jwt from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer'
import { JWT_ACCESS_TOKEN_CONFIG, JWT_REFRESH_TOKEN_CONFIG } from './jwt.constants';

@Injectable()
export class JwtService {
    constructor(
        @Inject(JWT_ACCESS_TOKEN_CONFIG) 
        private readonly accessTokenConfig: JwtAccessTokenConfig,
        @Inject(JWT_REFRESH_TOKEN_CONFIG) 
        private readonly refreshTokenConfig: JwtRefreshTokenConfig
    ) {}

    generateToken(payload: JwtPayload) {
        const newToken = plainToInstance(Token, {
            accessToken: jwt.sign(Object.assign({}, payload), this.accessTokenConfig.secret, { algorithm: "HS256" }),
            refreshToken: jwt.sign(Object.assign({}, payload), this.refreshTokenConfig.secret, { algorithm: "HS256" })
        })
        return newToken
    }

    verify(token: string, secret: string) {
        const payload = jwt.verify(token, secret) as JwtPayload
        return payload
    }

    decode(token: string) {
        const payload = jwt.decode(token) as JwtPayload
        return payload
    }
}
