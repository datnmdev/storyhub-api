import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { SignInWithEmailPasswordDto } from './dto/sign-in-with-email-password.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('sign-in/email-password')
	signInWithEmailPassword(
		@Body() signInWithEmailPasswordDto: SignInWithEmailPasswordDto,
	) {
		return this.authService.signInWithEmailPassword(
			signInWithEmailPasswordDto,
		);
	}

	@Get('sign-in/google')
	signInWithGoogle() {
		return this.authService.signInWithGoogle();
	}

	@Get('sign-in/google/callback')
	signInWithGoogleCallback(@Query() query: ParameterDecorator) {
		return this.authService.signInWithGoogleCallback(query);
	}

	@Get('sign-in/google/get-token')
	getTokenAfterOAuth(@Query("state") state: string) {
		return this.authService.getTokenAfterOAuth(state);
	}

	@Post('validate-token')
	validateToken(@Headers("Authorization") authorization: string) {
		return this.authService.validateToken(authorization);
	}

	@Post('refresh-token')
	refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refreshToken(refreshTokenDto);
	}

	@Post('sign-out')
	signOut(@Body() signOutDto: SignOutDto) {
		return this.authService.signOut(signOutDto);
	}

	@Post("sign-up")
	signUp(@Body() signUpDto: SignUpDto) {
		return this.authService.signUp(signUpDto);
	}

	@Get("validate-email")
	validateEmail(@Query() validateEmailDto: ValidateEmailDto) {
		return this.authService.validateEmail(validateEmailDto.email);
	}

	@Post("verify-account")
	verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
		return this.authService.verifyAccount(verifyAccountDto);
	}

	@Post("resend-otp")
	resendOtp(@Body() resendOtpDto: ResendOtpDto) {
		return this.authService.resendOtp(resendOtpDto);
	}
}
