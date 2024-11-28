import { Module } from '@nestjs/common';
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
import path from 'path';
import { ReaderModule } from './modules/reader/reader.module';
import { MailModule } from './common/mail/mail.module';
import { BullModule } from './common/bull/bull.module';
import { ConfigModule } from './common/config/config.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { GuardModule } from './common/guards/guard.module';
import { DepositeTransactionModule } from './modules/deposite-transaction/deposite-transaction.module';

import { NotificationUserModule } from './modules/notification-user/notification-user.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CountryModule } from './modules/country/country.module';
@Module({
	imports: [
		ConfigModule,
		ServeStaticModule.forRoot({
			rootPath: path.join(process.cwd(), 'public'),
			serveRoot: '/public',
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
		BullModule,
		MailModule,
		GuardModule,
		AuthModule,
		UserModule,
		ReaderModule,
		NotificationUserModule,
		NotificationModule,
		WalletModule,
		DepositeTransactionModule,
		CountryModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthorizationMiddleware)
			.forRoutes(
				'auth/sign-out',
				'user',
				'wallet',
				'deposite-transaction/create-payment-url',
				'deposite-transaction/get-payment-status',
				'deposite-transaction/get-deposite-transaction-history',
			);
	}
}
