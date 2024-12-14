import {
	Column,
	Entity,
	Generated,
	Index,
	JoinColumn,
	ManyToOne
} from 'typeorm';
import { Chapter } from './Chapter';
import { Reader } from './Reader';

@Index('FK_history_reader_idx', ['readerId'], {})
@Index('FK_history_chapter_idx', ['chapterId'], {})
@Entity('history', { schema: 'storyhub' })
export class History {
	@Column({ type: 'int', name: 'id', unique: true })
	@Generated('increment')
	id: number;

	@Column('text', { name: 'position' })
	position: string;

	@Column('datetime', {
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@Column('datetime', {
		name: 'updated_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;

	@Column('int', { primary: true, name: 'reader_id' })
	readerId: number;

	@Column('int', { primary: true, name: 'chapter_id' })
	chapterId: number;

	@ManyToOne(() => Chapter, (chapter) => chapter.histories, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
	chapter: Chapter;

	@ManyToOne(() => Reader, (reader) => reader.histories, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
	reader: Reader;
}
