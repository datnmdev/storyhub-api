import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JobName, QueueName } from '../constants/bull.constants';

@Injectable()
export class BullService {
    constructor(
        @InjectQueue(QueueName.MAIL) private mailQueue: Queue
    ) {}

    addJob(name: JobName, data: any) {
        return this.mailQueue.add(name, data);
    }
}