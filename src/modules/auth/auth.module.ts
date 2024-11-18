import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtModule } from '@/common/jwt/jwt.module';
import { EmailPasswordCredential } from './entities/email-password-credential.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			EmailPasswordCredential
		]),
		JwtModule
	],
	controllers: [AuthController],
	providers: [
		AuthService
	],
})
export class AuthModule {}
