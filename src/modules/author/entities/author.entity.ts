import { BankAccount } from '@/database/entities/BankAccount';
import { ModerationRequest } from '@/database/entities/ModerationRequest';
import { Story } from '@/database/entities/Story';
import { WithdrawRequest } from '@/database/entities/WithdrawRequest';
import { User } from '@/modules/user/entities/user.entity';
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';

@Entity('author', { schema: 'storyhub' })
export class Author {
	@PrimaryColumn('int', { primary: true, name: 'id' })
	id: number;

	@OneToOne(() => User, (user) => user.author, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
	user: User;

	@OneToOne(() => BankAccount, (bankAccount) => bankAccount.author)
	bankAccount: BankAccount;

	@OneToMany(
		() => ModerationRequest,
		(moderationRequest) => moderationRequest.requester,
	)
	moderationRequests: ModerationRequest[];

	@OneToMany(() => Story, (story) => story.author)
	stories: Story[];

	@OneToMany(
		() => WithdrawRequest,
		(withdrawRequest) => withdrawRequest.requester,
	)
	withdrawRequests: WithdrawRequest[];
}