import { Chapter } from '@/database/entities/Chapter';
import { CommentInteraction } from '@/database/entities/CommentInteraction';
import { Notification } from '@/database/entities/Notification';
import { Story } from '@/database/entities/Story';
import { Reader } from '@/modules/reader/entities/reader.entity';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FK_comment_reader_idx', ['readerId'], {})
@Index('FK_comment_commentparent_idx', ['parentId'], {})
@Index('FK_comment_story_idx', ['storyId'], {})
@Index('FK_comment_chapter_idx', ['chapterId'], {})
@Entity('comment', { schema: 'storyhub' })
export class Comment {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('int', {
		name: 'type',
		comment:
			'- type chỉ loại comment bao gồm các giá trị và ý nghĩa tương ứng là:\n+ 0: Loại bình luận theo truyện\n+ 1: Loại bình luận theo chương',
	})
	type: number;

	@Column('longtext', { name: 'content' })
	content: string;

	@Column('int', { name: 'parent_id', nullable: true })
	parentId: number | null;

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

	@Column('int', { name: 'story_id', nullable: true })
	storyId: number | null;

	@Column('int', { name: 'chapter_id', nullable: true })
	chapterId: number | null;

	@Column('int', { name: 'reader_id' })
	readerId: number;

	@ManyToOne(() => Chapter, (chapter) => chapter.comments, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
	chapter: Chapter;

	@ManyToOne(() => Comment, (comment) => comment.comments, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'parent_id', referencedColumnName: 'id' }])
	parent: Comment;

	@OneToMany(() => Comment, (comment) => comment.parent)
	comments: Comment[];

	@ManyToOne(() => Reader, (reader) => reader.comments, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
	reader: Reader;

	@ManyToOne(() => Story, (story) => story.comments, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
	story: Story;

	@OneToMany(
		() => CommentInteraction,
		(commentInteraction) => commentInteraction.comment,
	)
	commentInteractions: CommentInteraction[];

	@OneToMany(
		() => Notification,
		(notification) => notification.responseComment,
	)
	notifications: Notification[];
}
