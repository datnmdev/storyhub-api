import { JwtPayload } from '@/common/jwt/jwt.type';

export interface User extends JwtPayload {}

declare module 'express' {
	export interface Request {
		user?: User;
	}
}
