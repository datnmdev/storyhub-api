import { HttpStatus } from '@nestjs/common';
import { HttpException } from './exception.define';

export class UnauthorizedException extends HttpException {
	constructor() {
		super({
			statusCode: HttpStatus.UNAUTHORIZED,
			error: 'Unauthorized',
			message: 'Unauthorized',
		});
	}
}
