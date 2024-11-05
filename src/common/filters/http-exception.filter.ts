import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const responseBody = {
      statusCode: status,
      error: exception.getResponse()['error'] || 'Unknown Error', // Lấy thông tin lỗi từ exception
      message: exception.message, // Thông điệp lỗi
    };

    response.status(status).json(responseBody);
  }
}