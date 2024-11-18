import {
	Column,
	Entity,
	Index,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Manager } from './Manager';
import { Story } from './Story';

@Index('FK_genre_manager_idx', ['creatorId'], {})
@Index('FTI_name', ['name'], { fulltext: true })
@Entity('genre', { schema: 'storyhub' })
export class Genre {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('text', { name: 'name' })
	name: string;

	@Column('longtext', { name: 'description', nullable: true })
	description: string | null;

	@Column('int', {
		name: 'creator_id',
		comment: 'creator_id là id của người quản lý tạo ra thể loại tương ứng',
	})
	creatorId: number;

	@ManyToOne(() => Manager, (manager) => manager.genres, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'creator_id', referencedColumnName: 'id' }])
	creator: Manager;

	@ManyToMany(() => Story, (story) => story.genres)
	@JoinTable({
		name: 'genre_detail',
		joinColumns: [{ name: 'genre_id', referencedColumnName: 'id' }],
		inverseJoinColumns: [{ name: 'story_id', referencedColumnName: 'id' }],
		schema: 'storyhub',
	})
	stories: Story[];
}
