import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '@/database/entities/Story';
import { Chapter } from '@/database/entities/Chapter';
import { Invoice } from '@/database/entities/Invoice';

@Module({
	imports: [TypeOrmModule.forFeature([Story, Chapter, Invoice])],
	controllers: [StatisticController],
	providers: [StatisticService],
})
export class StatisticModule {}
