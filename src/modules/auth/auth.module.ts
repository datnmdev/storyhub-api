import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { EmailPasswordCredential } from './entities/email-password-credential.entity';
import { UserModule } from '../user/user.module';
import { Account } from './entities/account.entity';
import { GoogleCredential } from './entities/google-credential.entity';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			EmailPasswordCredential,
			Account,
			GoogleCredential,
		]),
		UserModule
	],
	controllers: [
		AuthController
	],
	providers: [
		AuthService
	],
})
export class AuthModule {}
