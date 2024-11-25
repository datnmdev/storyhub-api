import { BullModule as _BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueName } from '../constants/bull.constants';
import { BullService } from './bull.service';
import { MailProcessor } from './processors/mail.processor';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ConfigService } from '../config/config.service';

@Module({
    imports: [
        _BullModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    
                    redis: {
                        host: configService.getRedisConfig().host,
                        port: configService.getRedisConfig().port,
                        password: configService.getRedisConfig().password,
                    },
                    prefix: "bull"
                }
            },
            inject: [
                ConfigService
            ]
        }),
        _BullModule.registerQueue({
            name: QueueName.MAIL,
        }),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter
          }),
        BullBoardModule.forFeature({
            name: QueueName.MAIL,
            adapter: BullAdapter
        }),
        MailModule,
        RedisModule
    ],
    providers: [
        BullService,
        MailProcessor
    ],
    exports: [
        BullService
    ]
})
export class BullModule { }