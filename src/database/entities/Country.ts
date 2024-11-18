import {
	Column,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Story } from './Story';

@Index('FTI_name', ['name'], { fulltext: true })
@Entity('country', { schema: 'storyhub' })
export class Country {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('text', { name: 'name' })
	name: string;

	@OneToMany(() => Story, (story) => story.country)
	stories: Story[];
}
