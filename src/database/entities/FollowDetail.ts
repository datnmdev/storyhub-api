import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Reader } from './Reader';
import { Story } from './Story';

@Index('FK_followDetail_story_idx', ['storyId'], {})
@Entity('follow_detail', { schema: 'storyhub' })
export class FollowDetail {
	@Column('int', { primary: true, name: 'reader_id' })
	readerId: number;

	@Column('int', { primary: true, name: 'story_id' })
	storyId: number;

	@Column('datetime', {
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@ManyToOne(() => Reader, (reader) => reader.followDetails, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
	reader: Reader;

	@ManyToOne(() => Story, (story) => story.followDetails, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
	story: Story;
}
