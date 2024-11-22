import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { SignInWithEmailPasswordDto } from './dto/sign-in-with-email-password.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignOutDto } from './dto/sign-out.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('sign-in/email-password')
	async signInWithEmailPassword(
		@Body() signInWithEmailPasswordDto: SignInWithEmailPasswordDto,
	) {
		return await this.authService.signInWithEmailPassword(
			signInWithEmailPasswordDto,
		);
	}

	@Get('sign-in/google')
	async signInWithGoogle() {
		return await this.authService.signInWithGoogle();
	}

	@Get('sign-in/google/callback')
	async signInWithGoogleCallback(@Query() query: ParameterDecorator) {
		return await this.authService.signInWithGoogleCallback(query);
	}

	@Get('sign-in/google/get-token')
	async getTokenAfterOAuth(@Query("state") state: string) {
		return await this.authService.getTokenAfterOAuth(state);
	}

	@Post('validate-token')
	async validateToken(@Headers("Authorization") authorization: string) {
		return await this.authService.validateToken(authorization);
	}

	@Post('refresh-token')
	async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return await this.authService.refreshToken(refreshTokenDto);
	}

	@Post('sign-out')
	async signOut(@Body() signOutDto: SignOutDto) {
		return await this.authService.signOut(signOutDto);
	}
}
