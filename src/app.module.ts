import { Module, RequestMethod } from '@nestjs/common';
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
import { AuthorizationMiddleware, VerifyUrlValidityMiddleware } from './common/middleware/middleware.service';
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
import { UrlResolverModule } from './modules/url-resolver/url-resolver.module';
import { UrlCipherModule } from './common/url-cipher/url-cipher.module';
import { ViewModule } from './modules/view/view.module';
import { FollowModule } from './modules/follow/follow.module';
import { RatingModule } from './modules/rating/rating.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './modules/author/author.module';
import { InvoiceModule } from './modules/invoice/invoice.module';

import { StatisticModule } from './modules/statistic/statistic.module';
import { ModeratorModule } from './modules/moderator/moderator.module';
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
		UrlCipherModule,
		UrlResolverModule,
		ViewModule,
		FollowModule,
		RatingModule,
		AuthorModule,
		InvoiceModule,
		StatisticModule,
		ModeratorModule
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthorizationMiddleware)
			.forRoutes(
				"auth/sign-out",
				"user",
				"wallet",
				"deposite-transaction/create-payment-url",
				"deposite-transaction/get-payment-status",
				"deposite-transaction/get-deposite-transaction-history",
				{
					path: "rating",
					method: RequestMethod.POST
				},
				{
					path: "rating",
					method: RequestMethod.PUT
				},
				{
					path: "rating",
					method: RequestMethod.GET
				},
				{
					path: "follow",
					method: RequestMethod.POST
				},
				{
					path: "follow",
					method: RequestMethod.DELETE
				},
				{
					path: "follow",
					method: RequestMethod.GET
				},
				{
					path: "invoice",
					method: RequestMethod.GET
				},
				"chapter/reader/content",
				{
					path: "invoice",
					method: RequestMethod.POST
				},
				{
					path: "moderator",
					method: RequestMethod.GET
				},
				{
					path: "moderator",
					method: RequestMethod.POST
				},
				{
					path: "moderator",
					method: RequestMethod.PUT
				},
				{
					path: "file-upload/get-pre-upload-avatar-url",
					method: RequestMethod.GET
				}
			)
			.apply(VerifyUrlValidityMiddleware)
			.forRoutes(
				"url-resolver"
			);
	}
}
