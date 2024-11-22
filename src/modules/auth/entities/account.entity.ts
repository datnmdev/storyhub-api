import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { EmailPasswordCredential } from './email-password-credential.entity';
import { GoogleCredential } from './google-credential.entity';
import { User } from '@/database/entities/User';

@Index('FK_account_role_idx', ['roleId'], {})
@Entity('account', { schema: 'storyhub' })
export class Account {
	@PrimaryColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('int', {
		name: 'status',
		comment:
			'- status có các giá trị và ý nghĩa tương ứng là:\n+ 0: khởi tạo (cần kích hoạt)\n+ 1: đã kích hoạt\n+ 2: bị khoá\n+ 3: đã xoá',
		default: () => "'0'",
	})
	status: number;

	@Column('datetime', {
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@Column('varchar', {
		name: 'auth_type',
		length: 255,
		default: () => "'email_password'",
	})
	authType: string;

	@Column('int', { name: 'role_id' })
	roleId: number;

	@ManyToOne(() => Role, (role) => role.accounts, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
	role: Role;

	@OneToOne(() => User, (user) => user.account, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
	user: User;

	@OneToOne(
		() => EmailPasswordCredential,
		(emailPasswordCredential) => emailPasswordCredential.account,
	)
	emailPasswordCredential: EmailPasswordCredential;

	@OneToOne(
		() => GoogleCredential,
		(googleCredential) => googleCredential.account,
	)
	googleCredential: GoogleCredential;
}
