import { Body, Controller, Headers, Inject, Post, Res } from '@nestjs/common';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import { AuthService } from './auth.service';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-in/email-password')
	async loginWithEmailPassword(
		@Body() emailPasswordCredentialDto: EmailPasswordCredentialDto,
	) {
		return await this.authService.loginWithEmailPassword(
			emailPasswordCredentialDto,
		);;
	}

	@Post('validate-token')
	async validateToken(@Headers("Authorization") authorization: string) {
		return await this.authService.validateToken(authorization);
	}

	@Post('refresh-token')
	async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return await this.authService.refreshToken(refreshTokenDto);
	}
}
