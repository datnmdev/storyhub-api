import { HttpStatus } from '@nestjs/common';
import { HttpException } from './exception.define';

export class NotEnoughMoneyException extends HttpException {
	constructor() {
		super({
			statusCode: HttpStatus.PAYMENT_REQUIRED,
			error: 'paymentRequired',
			message: 'Payment Required. Please top up your account.',
		});
	}
}
