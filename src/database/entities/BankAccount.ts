import {Column,Entity,JoinColumn,OneToOne} from "typeorm";
import {Author} from './Author'


@Entity("bank_account" ,{schema:"storyhub" } )
export  class BankAccount {

@Column("int",{ primary:true,name:"id" })
id:number;

@Column("varchar",{ name:"account_number",length:255 })
accountNumber:string;

@Column("varchar",{ name:"owner_name",length:255 })
ownerName:string;

@Column("varchar",{ name:"bank_code",length:50 })
bankCode:string;

@OneToOne(()=>Author,author=>author.bankAccount,{ onDelete:"NO ACTION",onUpdate:"NO ACTION" })
@JoinColumn([{ name: "id", referencedColumnName: "id" },
])author:Author;

}
