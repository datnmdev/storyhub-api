import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from './common/jwt/jwt.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.dev`
			],
		}),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.HOST_DB,
			port: Number(process.env.PORT_DB),
			username: process.env.USERNAME_DB,
			password: process.env.PASSWORD_DB,
			database: process.env.DB_NAME,
			entities: [
				"dist/**/entities/*.js"
			],
			synchronize: false,
		}),
		RedisModule.forRoot({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
			password: process.env.REDIS_PASSWORD
		}),
		JwtModule,
		AuthModule
	],
})
export class AppModule { }
