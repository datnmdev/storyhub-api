import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './modules/author/author.module';
import * as path from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, `../.env.${process.env.NODE_ENV || 'dev'}`), // Tải tệp môi trường dựa trên NODE_ENV
      ],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('HOST_DB'),
        port: +configService.get('PORT_DB'),
        username: configService.get('USERNAME_DB'),
        password: configService.get('PASSWORD_DB'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/database/entities/*.{ts,js}'],
        synchronize: false,
        logging: true,
        logger: 'advanced-console',
      }),
      inject: [ConfigService],
    }),

    AuthorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
