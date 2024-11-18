import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from './Story';

@Index('FK_alias_story_idx', ['storyId'], {})
@Index('FTI_name', ['name'], { fulltext: true })
@Entity('alias', { schema: 'storyhub' })
export class Alias {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('text', { name: 'name' })
	name: string;

	@Column('int', { name: 'story_id' })
	storyId: number;

	@ManyToOne(() => Story, (story) => story.aliases, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'story_id', referencedColumnName: 'id' }])
	story: Story;
}
