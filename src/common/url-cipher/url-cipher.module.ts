import { Global, Module } from "@nestjs/common";
import { UrlCipherService } from "./url-cipher.service";

@Global()
@Module({
    providers: [
        UrlCipherService
    ],
    exports: [
        UrlCipherService
    ]
})
export class UrlCipherModule {}