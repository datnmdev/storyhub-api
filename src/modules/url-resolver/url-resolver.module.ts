import { Module } from "@nestjs/common";
import { UrlResolverService } from "./url-resolver.service";
import { UrlResolverController } from "./url-resolver.controller";
import { FileUploadModule } from "../file-upload/file-upload.module";

@Module({
    imports: [
        FileUploadModule
    ],
    controllers: [
        UrlResolverController
    ],
    providers: [
        UrlResolverService
    ],
    exports: [
        UrlResolverService
    ]
})
export class UrlResolverModule { }