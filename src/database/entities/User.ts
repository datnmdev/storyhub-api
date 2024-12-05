import {
	Column,
	Entity,
	Index,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { Author } from './Author';
import { Manager } from './Manager';
import { Moderator } from './Moderator';
import { NotificationUser } from './NotificationUser';
import { Reader } from './Reader';
import { Wallet } from './Wallet';

@Index('FTI_name', ['name'], { fulltext: true })
@Entity('user', { schema: 'storyhub' })
export class User {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('varchar', { name: 'name', length: 255 })
	name: string;

	@Column('date', { name: 'dob', nullable: true })
	dob: Date | null;

	@Column('int', {
		name: 'gender',
		nullable: true,
		comment:
			'- gender (giới tính) có các giá trị và ý nghĩa tương ứng là:\n+ 0: Nam\n+ 1: Nữ\n+ 2: Khác',
	})
	gender: number | null;

	@Column('varchar', { name: 'phone', nullable: true, length: 20 })
	phone: string | null;

	@Column('longtext', { name: 'avatar', nullable: true })
	avatar: string | null;

	@Column('datetime', {
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@Column('datetime', {
		name: 'updated_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;

	@OneToOne(() => Account, (account) => account.user)
	account: Account;

	@OneToOne(() => Author, (author) => author.user)
	author: Author;

	@OneToOne(() => Manager, (manager) => manager.user)
	manager: Manager;

	@OneToOne(() => Moderator, (moderator) => moderator.user)
	moderator: Moderator;

	@OneToMany(
		() => NotificationUser,
		(notificationUser) => notificationUser.receiver,
	)
	notificationUsers: NotificationUser[];

	@OneToOne(() => Reader, (reader) => reader.user)
	reader: Reader;

	@OneToOne(() => Wallet, (wallet) => wallet.user)
	wallet: Wallet;
}
