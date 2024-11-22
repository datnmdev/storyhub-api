import { OAuthStatus } from "../constants/oauth.constants"
import { Token } from "../jwt/jwt.type"

export interface OAuthState {
    status: OAuthStatus
    token: Token
}