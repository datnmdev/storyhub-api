const KeyGenerator = {
    accessTokenKey: (accessToken: string) => {
        return `token:access-token:${accessToken}`
    },
    refreshTokenKey: (refreshToken: string) => {
        return `token:refresh-token:${refreshToken}`
    }
}

export default KeyGenerator