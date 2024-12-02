import { Injectable } from "@nestjs/common";
import { EncryptedUrl, UrlCipherPayload } from "./url-cipher.class";
import crypto from "crypto";
import { ConfigService } from "../config/config.service";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UrlCipherService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    generate(payload: UrlCipherPayload) {
        const encode = Buffer.from(JSON.stringify(payload)).toString('base64')
        const hash = crypto.createHmac('sha256', this.configService.getUrlCipherConfig().urlCipherSecret).update(encode).digest('hex')
        return plainToInstance(EncryptedUrl, {
            encode,
            hash
        })
    }

    verify(encryptedUrl: EncryptedUrl) {
        const expectedHash = crypto.createHmac('sha256', this.configService.getUrlCipherConfig().urlCipherSecret).update(encryptedUrl.encode).digest('hex')
        if (encryptedUrl.hash !== expectedHash) {
            return false
        }
        const payload: UrlCipherPayload = JSON.parse(Buffer.from(encryptedUrl.encode, 'base64').toString('utf8'))
        if (Date.now() > payload.iat + (payload.expireIn * 1000)) {
            return false
        }
        return true
    }

    decode(encryptedUrl: EncryptedUrl) {
        const payload: UrlCipherPayload = JSON.parse(Buffer.from(encryptedUrl.encode, 'base64').toString('utf8'))
        return payload;
    }
}