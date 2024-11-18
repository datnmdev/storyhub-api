import { UnauthorizedException } from "@nestjs/common";

export class InvalidEmailPasswordException extends UnauthorizedException {
    constructor() {
        super("Địa chỉ email hoặc mật khẩu không đúng")
    }
}