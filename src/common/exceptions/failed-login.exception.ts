import { HttpStatus } from '@nestjs/common';
import { HttpException } from './exception.define';

export class FailedSignInException extends HttpException {
	constructor() {
		super({
			statusCode: HttpStatus.UNAUTHORIZED,
			error: 'FailedSignIn',
			message: 'Địa chỉ emai hoặc mật khẩu không đúng',
		});
	}
}
