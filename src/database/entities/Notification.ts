import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { DepositeTransaction } from './DepositeTransaction';
import { ModerationRequest } from './ModerationRequest';
import { Comment } from './Comment';
import { WithdrawRequest } from './WithdrawRequest';
import { NotificationUser } from './NotificationUser';

@Index('FK_notification_moderationRequest_idx', ['moderationRequestId'], {})
@Index('FK_notification_responseComment_idx', ['responseCommentId'], {})
@Index('FK_notification_depositeTransaction_idx', ['depositeTransactionId'], {})
@Index('FK_notification_withdrawRequest_idx', ['withdrawRequestId'], {})
@Entity('notification', { schema: 'storyhub' })
export class Notification {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('int', {
		name: 'type',
		comment:
			'- type là loại thông báo bao gồm các giá trị và ý nghĩa tương ứng là:\n+ 0: Loại thông báo liên quan đến truyện \n+ 1: Loại thông báo liên quan đến bình luận\n+ 2: Loại thông báo liên quan đến việc nạp tiền\n+ 3: Loại thông báo liên quan đến việc rút tiền\n+ 4: Loại thông báo liên quan đến việc báo cáo vi phạm',
	})
	type: number;

	@Column('datetime', {
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@Column('int', { name: 'moderation_request_id', nullable: true })
	moderationRequestId: number | null;

	@Column('int', { name: 'response_comment_id', nullable: true })
	responseCommentId: number | null;

	@Column('int', { name: 'deposite_transaction_id', nullable: true })
	depositeTransactionId: number | null;

	@Column('int', { name: 'withdraw_request_id', nullable: true })
	withdrawRequestId: number | null;

	@ManyToOne(
		() => DepositeTransaction,
		(depositeTransaction) => depositeTransaction.notifications,
		{ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
	)
	@JoinColumn([
		{ name: 'deposite_transaction_id', referencedColumnName: 'id' },
	])
	depositeTransaction: DepositeTransaction;

	@ManyToOne(
		() => ModerationRequest,
		(moderationRequest) => moderationRequest.notifications,
		{ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
	)
	@JoinColumn([{ name: 'moderation_request_id', referencedColumnName: 'id' }])
	moderationRequest: ModerationRequest;

	@ManyToOne(() => Comment, (comment) => comment.notifications, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'response_comment_id', referencedColumnName: 'id' }])
	responseComment: Comment;

	@ManyToOne(
		() => WithdrawRequest,
		(withdrawRequest) => withdrawRequest.notifications,
		{ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
	)
	@JoinColumn([{ name: 'withdraw_request_id', referencedColumnName: 'id' }])
	withdrawRequest: WithdrawRequest;

	@OneToMany(
		() => NotificationUser,
		(notificationUser) => notificationUser.notification,
	)
	notificationUsers: NotificationUser[];
}
