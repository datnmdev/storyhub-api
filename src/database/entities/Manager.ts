import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { Genre } from './Genre';
import { User } from './User';
import { Moderator } from './Moderator';
import { WithdrawRequest } from './WithdrawRequest';

@Entity('manager', { schema: 'storyhub' })
export class Manager {
	@PrimaryColumn('int', { primary: true, name: 'id' })
	id: number;

	@OneToMany(() => Genre, (genre) => genre.creator)
	genres: Genre[];

	@OneToOne(() => User, (user) => user.manager, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
	user: User;

	@OneToMany(() => Moderator, (moderator) => moderator.manager)
	moderators: Moderator[];

	@OneToMany(
		() => WithdrawRequest,
		(withdrawRequest) => withdrawRequest.processor,
	)
	withdrawRequests: WithdrawRequest[];
}
