import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { ModerationRequest } from './ModerationRequest';
import { Manager } from './Manager';
import { User } from './User';

@Index('FK_moderator_manager_idx', ['managerId'], {})
@Entity('moderator', { schema: 'storyhub' })
export class Moderator {
	@PrimaryColumn('int', { primary: true, name: 'id' })
	id: number;

	@Column('varchar', { name: 'cccd', length: 12, unique: true })
	cccd: string;

	@Column('text', { name: 'address' })
	address: string;

	@Column('int', {
		name: 'status',
		comment:
			'- status có các giá trị và ý nghĩa tương ứng là:\\n+ 0: Đang làm việc\\n+ 1: Đã nghỉ việc',
		default: () => "'0'",
	})
	status: number;

	@Column('date', {
		name: 'doj',
		nullable: false
	})
	doj: Date;

	@Column('int', { name: 'manager_id' })
	managerId: number;

	@OneToMany(
		() => ModerationRequest,
		(moderationRequest) => moderationRequest.responser,
	)
	moderationRequests: ModerationRequest[];

	@ManyToOne(() => Manager, (manager) => manager.moderators, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'manager_id', referencedColumnName: 'id' }])
	manager: Manager;

	@OneToOne(() => User, (user) => user.moderator, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
	user: User;
}