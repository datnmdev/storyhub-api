import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('google_credential', { schema: 'storyhub' })
export class GoogleCredential {
	@PrimaryColumn('int', { primary: true, name: 'id' })
	id: number;

	@Column('varchar', { name: 'uid', length: 255 })
	uid: string;

	@OneToOne(() => Account, (account) => account.googleCredential, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'id', referencedColumnName: 'id' }])
	account: Account;
}
