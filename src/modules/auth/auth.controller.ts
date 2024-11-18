import { Body, Controller, Inject, Post } from '@nestjs/common';
import { EmailPasswordCredentialDto } from './dto/email-password-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
	) {}

	@Post("email")
	async loginWithEmailPassword(@Body() emailPasswordCredentialDto: EmailPasswordCredentialDto) {
		const token = await this.authService.loginWithEmailPassword(emailPasswordCredentialDto)
		return token
	}
}
