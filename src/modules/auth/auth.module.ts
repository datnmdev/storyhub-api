import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { EmailPasswordCredential } from './entities/email-password-credential.entity';
import { Account } from './entities/account.entity';
import { GoogleCredential } from './entities/google-credential.entity';
import { AuthController } from './auth.controller';
import { BullModule } from '@/common/bull/bull.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			EmailPasswordCredential,
			Account,
			GoogleCredential,
		]),
		BullModule
	],
	controllers: [
		AuthController
	],
	providers: [
		AuthService
	],
})
export class AuthModule {}
