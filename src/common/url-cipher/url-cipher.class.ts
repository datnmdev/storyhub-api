export class UrlCipherPayload {
    url: string
    expireIn: number
    iat: number
}

export class EncryptedUrl {
    encode: string
    hash: string
}