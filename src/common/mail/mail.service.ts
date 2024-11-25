import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendOtpToVerifyAccount(otp: string, to: string) {
    return this.mailerService
      .sendMail({
        to,
        from: 'no-reply@storyhub.com',
        subject: 'Xác thực tài khoản tại storyhub',
        template: './verify-account',
        context: {
          otp
        }
      })
  }
}