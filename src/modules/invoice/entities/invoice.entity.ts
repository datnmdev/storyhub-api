import { Chapter } from '@/database/entities/Chapter';
import { Reader } from '@/modules/reader/entities/reader.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index('FK_invoice_chapter_idx', ['chapterId'], {})
@Entity('invoice', { schema: 'storyhub' })
export class Invoice {
	@Column('int', { primary: true, name: 'reader_id' })
	readerId: number;

	@Column('int', { primary: true, name: 'chapter_id' })
	chapterId: number;

	@Column('decimal', { name: 'total_amount', precision: 18, scale: 0 })
	totalAmount: string;

	@Column('datetime', {
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@ManyToOne(() => Chapter, (chapter) => chapter.invoices, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
	chapter: Chapter;

	@ManyToOne(() => Reader, (reader) => reader.invoices, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
	reader: Reader;
}
