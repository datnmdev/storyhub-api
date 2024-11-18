export const jwtAccessTokenConfig = () => ({
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRE),
})

export const jwtRefreshTokenConfig = ()  => ({
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRE),
})