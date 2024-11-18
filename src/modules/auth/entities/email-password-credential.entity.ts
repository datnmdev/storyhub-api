import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('email_password_credential', { schema: 'storyhub' })
export class EmailPasswordCredential {
	@PrimaryColumn('int', { primary: true, name: 'id' })
	id: number;

	@Column('varchar', { name: 'email', length: 255 })
	email: string;

	@Column('varchar', { name: 'password', length: 500 })
	password: string;

	@OneToOne(() => Account, (account) => account.emailPasswordCredential, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
	account: Account;
}
