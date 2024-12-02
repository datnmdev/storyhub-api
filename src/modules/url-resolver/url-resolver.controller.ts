import { Controller, Get, Next, NotFoundException, Query, Res } from "@nestjs/common";
import { GetDataDto } from "./dto/get-data.dto";
import { NextFunction, Response } from "express";
import { UrlCipherService } from "@/common/url-cipher/url-cipher.service";
import { plainToInstance } from "class-transformer";
import { EncryptedUrl } from "@/common/url-cipher/url-cipher.class";
import { UrlPrefix } from "@/common/constants/url-resolver.constants";
import axios from "axios";
import { FileUploadService } from "../file-upload/file-upload.service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@/common/config/config.service";

@Controller("url-resolver")
export class UrlResolverController {
    constructor(
        private readonly urlCipherService: UrlCipherService,
        private readonly fileUploadService: FileUploadService,
        private readonly configService: ConfigService
    ) { }

    @Get()
    async getData(@Query() getDataDto: GetDataDto, @Res() res: Response, @Next() next: NextFunction) {
        const payload = this.urlCipherService.decode(plainToInstance(EncryptedUrl, getDataDto));
        let response: any;
        if (payload.url.startsWith(UrlPrefix.EXTERNAL_TRUYENQQ)) {
            response = await axios({
                url: payload.url.substring(UrlPrefix.EXTERNAL_TRUYENQQ.length),
                method: 'get',
                headers: {
                    Referer: 'https://truyenqqviet.com/'
                },
                responseType: 'stream'
            })
        } else if (payload.url.startsWith(UrlPrefix.EXTERNAL_TRUYENFULL)) {
            response = await axios({
                url: payload.url.substring(UrlPrefix.EXTERNAL_TRUYENFULL.length),
                method: 'get',
                responseType: 'stream'
            })
        } else if (payload.url.startsWith(UrlPrefix.EXTERNAL_GOOGLE)) {
            response = await axios({
                url: payload.url.substring(UrlPrefix.EXTERNAL_GOOGLE.length),
                method: 'get',
                responseType: 'stream'
            })
        } else if (payload.url.startsWith(UrlPrefix.INTERNAL_AWS_S3)) {
            const awsS3Client = this.fileUploadService.getAwsS3Client();
            response = await axios({
                url: await getSignedUrl(awsS3Client, new GetObjectCommand({
                    Bucket: this.configService.getAwsS3Config().awsS3BucketName,
                    Key: payload.url.substring(UrlPrefix.INTERNAL_AWS_S3.length)
                })),
                method: 'get',
                responseType: 'stream'
            })
        } else {
            return next(new NotFoundException())
        }
        res.setHeader('Content-Type', response.headers['content-type'])
        return response.data.pipe(res)
    }
}