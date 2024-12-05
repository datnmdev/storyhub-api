import { Injectable } from '@nestjs/common';
import { DataStaticsticDto } from './dto/data-staticstic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In } from 'typeorm';
import { Story } from '@/database/entities/Story';
import { Repository } from 'typeorm';
import { Chapter } from '@/database/entities/Chapter';
import { Invoice } from '@/database/entities/Invoice';
import moment from 'moment';
import {
	calculate,
	calculateTotalByType,
} from '@/common/handleLogicStatistic/handle';

@Injectable()
export class StatisticService {
	constructor(
		@InjectRepository(Story)
		private readonly storyRepository: Repository<Story>,

		@InjectRepository(Chapter)
		private readonly chapterRepository: Repository<Chapter>,

		@InjectRepository(Invoice)
		private readonly invoiceRepository: Repository<Invoice>,
	) {}
	async calculateRevenue(
		dataStaticsticDto: DataStaticsticDto,
	): Promise<any[]> {
		// Tính toán thời gian bắt đầu và kết thúc tùy theo type (ngày, tháng, năm)
		let startMoment = moment(dataStaticsticDto.startDate);
		let endMoment = moment(dataStaticsticDto.endDate);

		// Lấy danh sách các stories của author
		const stories = await this.storyRepository.find({
			where: { authorId: dataStaticsticDto.authorId },
		});

		// Lấy danh sách các chapters của author trong khoảng thời gian
		const chapters = await this.chapterRepository.find({
			where: {
				storyId: In(stories.map((story) => story.id)),
			},
		});

		// Lọc các invoices thuộc các chapter và nằm trong khoảng thời gian đã chọn
		const invoices = await this.invoiceRepository.find({
			where: {
				chapterId: In(chapters.map((chapter) => chapter.id)),
				createdAt: Between(startMoment.toDate(), endMoment.toDate()),
			},
		});

		return calculateTotalByType(
			calculate(invoices),
			+dataStaticsticDto.type,
		);
	}
}
