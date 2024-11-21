import { HttpException as _HttpException } from '@nestjs/common';

export interface Response {
	statusCode: number;
	error: string;
	message: string;
}

export class HttpException extends _HttpException {
	constructor(response: Response) {
		super(response, response.statusCode);
	}
}
