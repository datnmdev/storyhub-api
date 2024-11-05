import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Kiểm tra xác thực ở đây
    console.log('Request...');
    next();
  }
}