import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StoryModule } from './modules/story/story.module';
import { AliasModule } from './modules/alias/alias.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { PriceModule } from './modules/price/price.module';
import { GenreModule } from './modules/genre/genre.module';
import { DatabaseModule } from '@/database/database.module';
import { EventsModule } from './gateway/events.module';
import { ModerationRequestModule } from './modules/moderation-request/moderation-request.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { ChapterImageModule } from './modules/chapter-image/chapter-image.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from './common/jwt/jwt.module';
import { RedisModule } from './common/redis/redis.module';
import { MiddlewareModule } from './common/middleware/middleware.module';
import { AuthorizationMiddleware } from './common/middleware/middleware.service';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';

@@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [`.env.dev`],
		}),
		ServeStaticModule.forRoot({
			rootPath: path.join(process.cwd(), 'public'),
			serveRoot: '/public',
		}),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.HOST_DB,
			port: Number(process.env.PORT_DB),
			username: process.env.USERNAME_DB,
			password: process.env.PASSWORD_DB,
			database: process.env.DB_NAME,
			entities: ['dist/**/entities/*.js'],
			synchronize: false,
		}),
		DatabaseModule,
		StoryModule,
		AliasModule,
		FileUploadModule,
		PriceModule,
		GenreModule,
		EventsModule,
		ModerationRequestModule,
		ChapterModule,
		ChapterImageModule,
		RedisModule.forRoot({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
			password: process.env.REDIS_PASSWORD,
		}),
		JwtModule,
		MiddlewareModule,
		AuthModule,
		UserModule,
  ],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthorizationMiddleware)
			.forRoutes("auth/sign-out", "user");
	}
}
