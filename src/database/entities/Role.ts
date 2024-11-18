import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './Account';

@Entity('role', { schema: 'storyhub' })
export class Role {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id: number;

	@Column('varchar', { name: 'name', length: 255 })
	name: string;

	@OneToMany(() => Account, (account) => account.role)
	accounts: Account[];
}
