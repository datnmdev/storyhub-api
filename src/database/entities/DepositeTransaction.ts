import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Reader } from './Reader';
import { Notification } from './Notification';

@Index('FK_depositeTransaction_reader_idx', ['readerId'], {})
@Entity('deposite_transaction', { schema: 'storyhub' })
export class DepositeTransaction {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('text', { name: 'transaction_no' })
	transactionNo: string;

	@Column('text', { name: 'bank_trans_no' })
	bankTransNo: string;

	@Column('varchar', { name: 'bank_code', length: 255 })
	bankCode: string;

	@Column('varchar', { name: 'card_type', length: 50 })
	cardType: string;

	@Column('decimal', { name: 'amount', precision: 18, scale: 0 })
	amount: string;

	@Column('longtext', { name: 'order_info' })
	orderInfo: string;

	@Column('datetime', { name: 'pay_date' })
	payDate: Date;

	@Column('int', {
		name: 'status',
		comment:
			'- status có các giá trị và ý nghĩa tương ứng là:\n+ 0: Thành công\n+ 1: Thất bại',
	})
	status: number;

	@Column('int', { name: 'reader_id' })
	readerId: number;

	@ManyToOne(() => Reader, (reader) => reader.depositeTransactions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
	reader: Reader;

	@OneToMany(
		() => Notification,
		(notification) => notification.depositeTransaction,
	)
	notifications: Notification[];
}
