import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Reader } from './Reader';
import { Story } from './Story';

@Index('FK_ratingDetail_story_idx', ['storyId'], {})
@Entity('rating_detail', { schema: 'storyhub' })
export class RatingDetail {
	@Column('int', { primary: true, name: 'reader_id' })
	readerId: number;

	@Column('int', { primary: true, name: 'story_id' })
	storyId: number;

	@Column('int', { name: 'stars' })
	stars: number;

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

	@ManyToOne(() => Reader, (reader) => reader.ratingDetails, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
	reader: Reader;

	@ManyToOne(() => Story, (story) => story.ratingDetails, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
	story: Story;
}
