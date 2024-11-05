import {Column,Entity,JoinColumn,OneToOne} from "typeorm";
import {Account} from './Account'


@Entity("email_password_credential" ,{schema:"storyhub" } )
export  class EmailPasswordCredential {

@Column("int",{ primary:true,name:"id" })
id:number;

@Column("varchar",{ name:"email",length:255 })
email:string;

@Column("varchar",{ name:"password",length:500 })
password:string;

@OneToOne(()=>Account,account=>account.emailPasswordCredential,{ onDelete:"NO ACTION",onUpdate:"NO ACTION" })
@JoinColumn([{ name: "id", referencedColumnName: "id" },
])account:Account;

}
