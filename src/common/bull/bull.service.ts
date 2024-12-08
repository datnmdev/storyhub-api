import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JobName, QueueName } from '../constants/bull.constants';

@Injectable()
export class BullService {
    constructor(
        @InjectQueue(QueueName.MAIL) 
        private mailQueue: Queue,
        @InjectQueue(QueueName.DELETE_FILE_AWS_S3) 
        private deleteFileAwsS3: Queue
    ) {}

    addJob(name: JobName, data: any) {
        return this.mailQueue.add(name, data);
    }

    addDeleteFileAwsS3Job(data: any) {
        return this.deleteFileAwsS3.add(JobName.DELETE_FILE_AWS_S3, data, {
            attempts: 5
        })
    }
}