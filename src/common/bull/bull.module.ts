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

@Module({
    imports: [
        _BullModule.forRoot({
            redis: {
                host: 'redis-12227.c80.us-east-1-2.ec2.redns.redis-cloud.com',
                port: 12227,
                password: 'TNBzyWOw2HNZuyqmGRjUezqL1Hw3j1Wp',
            },
            prefix: "bull:"
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