import { ConfigService } from "@/common/config/config.service";
import { JobName, QueueName } from "@/common/constants/bull.constants";
import { UrlPrefix } from "@/common/constants/url-resolver.constants";
import { FileUploadService } from "@/modules/file-upload/file-upload.service";
import { UserService } from "@/modules/user/user.service";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor(QueueName.DELETE_FILE_AWS_S3)
export class DeleteFileAWSS3Processor {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileUploadService: FileUploadService,
    private readonly userService: UserService
  ) { }

  @Process(JobName.DELETE_FILE_AWS_S3)
  async deleteFileAwsS3(job: Job) {
    try {
      await new Promise((resolve) => {
        setTimeout(async () => {
          const user = await this.userService.findOneBy(job.data.userId);
          if (user.avatar !== null && user.avatar.replace(UrlPrefix.INTERNAL_AWS_S3, '') != job.data.fileKey) {
            await this.fileUploadService.getAwsS3Client().send(new DeleteObjectCommand({
              Bucket: this.configService.getAwsS3Config().awsS3BucketName,
              Key: job.data.fileKey
            }))
          }
          resolve(null);
        }, job.data.delay * 1000);
      })
    } catch (error) {
      return error;
    }
  }
}
