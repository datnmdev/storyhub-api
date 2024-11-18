import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Chapter } from './Chapter';

@Index('FK_chapterimage_chapter_idx', ['chapterId'], {})
@Entity('chapter_image', { schema: 'storyhub' })
export class ChapterImage {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('int', { name: 'order' })
	order: number;

	@Column('longtext', { name: 'path' })
	path: string;

	@Column('int', { name: 'chapter_id' })
	chapterId: number;

	@ManyToOne(() => Chapter, (chapter) => chapter.chapterImages, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
	chapter: Chapter;
}
