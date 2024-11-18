import { Expose } from "class-transformer"
import { jwtAccessTokenConfig, jwtRefreshTokenConfig } from "./jwt.config"

export type JwtAccessTokenConfig = ReturnType<typeof jwtAccessTokenConfig>
export type JwtRefreshTokenConfig = ReturnType<typeof jwtRefreshTokenConfig>

export class Token {
    accessToken: string
    refreshToken: string
}

export class JwtPayload {
    @Expose()
    accountId: number
    role: number
    status: number
    iat: number = Date.now()
}