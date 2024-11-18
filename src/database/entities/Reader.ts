import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { Comment } from './Comment';
import { CommentInteraction } from './CommentInteraction';
import { DepositeTransaction } from './DepositeTransaction';
import { FollowDetail } from './FollowDetail';
import { History } from './History';
import { Invoice } from './Invoice';
import { RatingDetail } from './RatingDetail';
import { User } from './User';

@Entity('Reader', { schema: 'storyhub' })
export class Reader {
	@PrimaryColumn('int', { primary: true, name: 'id' })
	id: number;

	@OneToMany(() => Comment, (comment) => comment.reader)
	comments: Comment[];

	@OneToMany(
		() => CommentInteraction,
		(commentInteraction) => commentInteraction.reader,
	)
	commentInteractions: CommentInteraction[];

	@OneToMany(
		() => DepositeTransaction,
		(depositeTransaction) => depositeTransaction.reader,
	)
	depositeTransactions: DepositeTransaction[];

	@OneToMany(() => FollowDetail, (followDetail) => followDetail.reader)
	followDetails: FollowDetail[];

	@OneToMany(() => History, (history) => history.reader)
	histories: History[];

	@OneToMany(() => Invoice, (invoice) => invoice.reader)
	invoices: Invoice[];

	@OneToMany(() => RatingDetail, (ratingDetail) => ratingDetail.reader)
	ratingDetails: RatingDetail[];

	@OneToOne(() => User, (user) => user.reader, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
	user: User;
}
