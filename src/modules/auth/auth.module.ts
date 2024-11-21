import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { EmailPasswordCredential } from './entities/email-password-credential.entity';

@Module({
	imports: [TypeOrmModule.forFeature([EmailPasswordCredential])],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
