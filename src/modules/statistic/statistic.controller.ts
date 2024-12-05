import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { DataStaticsticDto } from './dto/data-staticstic.dto';

@Controller('statistic')
export class StatisticController {
	constructor(private readonly statisticService: StatisticService) {}

	@Get('revenue-by-time')
	async findAllRevenueByTime(@Query() dataStaticsticQuery: any) {
		const dataStaticsticDto = new DataStaticsticDto();
		Object.assign(dataStaticsticDto, dataStaticsticQuery);
		return this.statisticService.calculateRevenue(dataStaticsticDto);
	}
}
