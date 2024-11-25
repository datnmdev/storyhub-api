import { Comment } from '@/database/entities/Comment';
import { CommentInteraction } from '@/database/entities/CommentInteraction';
import { DepositeTransaction } from '@/database/entities/DepositeTransaction';
import { FollowDetail } from '@/database/entities/FollowDetail';
import { History } from '@/database/entities/History';
import { Invoice } from '@/database/entities/Invoice';
import { RatingDetail } from '@/database/entities/RatingDetail';
import { User } from '@/modules/user/entities/user.entity';

import {
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';

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