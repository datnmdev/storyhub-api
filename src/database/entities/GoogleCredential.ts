import {Column,Entity,JoinColumn,OneToOne} from "typeorm";
import {Account} from './Account'


@Entity("google_credential" ,{schema:"storyhub" } )
export  class GoogleCredential {

@Column("int",{ primary:true,name:"id" })
id:number;

@Column("varchar",{ name:"uid",length:255 })
uid:string;

@OneToOne(()=>Account,account=>account.googleCredential,{ onDelete:"NO ACTION",onUpdate:"NO ACTION" })
@JoinColumn([{ name: "id", referencedColumnName: "id" },
])account:Account;

}
