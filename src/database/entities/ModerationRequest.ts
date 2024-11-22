import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from './Author';
import { Chapter } from './Chapter';
import { Moderator } from './Moderator';
import { Story } from './Story';
import { Notification } from './Notification';

@Index('FK_moderationRequest_author_idx', ['requesterId'], {})
@Index('FK_moderationRequest_moderator_idx', ['responserId'], {})
@Index('FK_moderationRequest_story_idx', ['storyId'], {})
@Index('FK_moderationRequest_chapter_idx', ['chapterId'], {})
@Entity('moderation_request', { schema: 'storyhub' })
export class ModerationRequest {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('longtext', {
		name: 'reason',
		nullable: true,
		comment:
			'reason là lý do mà yêu cầu được gửi từ tác giả được duyệt hay không được duyệt bởi kiểm duyệt viên',
	})
	reason: string | null;

	@Column('int', {
		name: 'status',
		comment:
			'- status có các giá trị và ý nghĩa tương ứng như sau:\n+ 0: Chờ xử lý\n+ 1: Đã được duyệt\n+ 2: Không được duyệt',
	})
	status: number;

	@Column('int', {
		name: 'type',
		comment:
			'- type là loại yêu cầu kiểm duyệt bao gồm các giá trị và ý nghĩa tương ứng là:\n+ 0: Loại yêu cầu kiểm duyệt truyện\n+ 1: Loại yêu cầu kiểm duyệt chương',
	})
	type: number;

	@Column('datetime', {
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@Column('datetime', { name: 'process_at', nullable: true })
	processAt: Date | null;

	@Column('int', { name: 'story_id', nullable: true })
	storyId: number | null;

	@Column('int', { name: 'chapter_id', nullable: true })
	chapterId: number | null;

	@Column('int', {
		name: 'requester_id',
		comment: 'Người gửi yêu cầu ở đây là tác giả',
	})
	requesterId: number;

	@Column('int', {
		name: 'responser_id',
		comment: 'Người xử lý yêu cầu ở đây là kiểm duyệt viên',
	})
	responserId: number;

	@ManyToOne(() => Author, (author) => author.moderationRequests, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'requester_id', referencedColumnName: 'id' }])
	requester: Author;

	@ManyToOne(() => Chapter, (chapter) => chapter.moderationRequests, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'chapter_id', referencedColumnName: 'id' }])
	chapter: Chapter;

	@ManyToOne(() => Moderator, (moderator) => moderator.moderationRequests, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'responser_id', referencedColumnName: 'id' }])
	responser: Moderator;

	@ManyToOne(() => Story, (story) => story.moderationRequests, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
	story: Story;

	@OneToMany(
		() => Notification,
		(notification) => notification.moderationRequest,
	)
	notifications: Notification[];
}