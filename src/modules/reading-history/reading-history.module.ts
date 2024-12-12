import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingHistoryController } from './reading-history.controller';
import { ReadingHistoryService } from './reading-history.service';
import { History } from './entities/reading-history.entity';

@Module({
	imports: [TypeOrmModule.forFeature([History])],
	controllers: [ReadingHistoryController],
	providers: [ReadingHistoryService]
})
export class ReadingHistoryModule {}
