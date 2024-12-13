import { JobName, QueueName } from "@/common/constants/bull.constants";
import { MailService } from "@/common/mail/mail.service";
import { REDIS_CLIENT } from "@/common/redis/redis.constants";
import { RedisClient } from "@/common/redis/redis.type";
import { SendAccountInfoToModeratorData, SendOtpData } from "@/common/types/mail.type";
import KeyGenerator from "@/common/utils/generate-key.util";
import { Process, Processor } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import { Job } from "bull";

@Processor(QueueName.MAIL)
export class MailProcessor {
  constructor(
    private readonly mailService: MailService,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient
  ) { }

  @Process(JobName.SEND_OTP_TO_VERIFY_ACCOUNT)
  async sendOtpToVerifyAccount(job: Job) {
    try {
      const data: SendOtpData = job.data;
      await this.redisClient.setEx(KeyGenerator.otpToVerifyAccountKey(data.accountId), 5 * 60, data.otp);
      await this.mailService.sendOtpToVerifyAccount(data.otp, data.to);
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  @Process(JobName.SEND_OTP_TO_RESET_PASSWORD)
  async sendOtpToResetPassword(job: Job) {
    try {
      const data: SendOtpData = job.data;
      await this.redisClient.setEx(KeyGenerator.otpToResetPasswordKey(data.accountId), 5 * 60, data.otp);
      await this.mailService.sendOtpToResetPassword(data.otp, data.to);
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  @Process(JobName.SEND_ACCOUNT_INFO_TO_MODERATOR)
  async sendAccountInfoToModerator(job: Job) {
    try {
      const data: SendAccountInfoToModeratorData = job.data;
      await this.mailService.sendAccountInfoToModerator(data.email, data.password, data.to);
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  @Process(JobName.SEND_OTP_TO_VERIFY_CHANGE_PASSWORD)
  async sendOtpToVerifyChangePassword(job: Job) {
    try {
      await this.redisClient.setEx(KeyGenerator.verifyChangePasswordInfoKey(job.data.accountId), 5 * 60, JSON.stringify({
        oldPassword: job.data.oldPassword,
        newPassword: job.data.newPassword,
        otp: job.data.otp
      }));
      await this.mailService.sendOtpToVerifyChangePassword(job.data.otp, job.data.to);
    } catch (error) {
      console.log(error);
    }
    return null;
  }
}
