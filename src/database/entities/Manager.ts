import {Column,Entity,JoinColumn,OneToMany,OneToOne} from "typeorm";
import {Genre} from './Genre'
import {User} from './User'
import {WithdrawRequest} from './WithdrawRequest'


@Entity("manager" ,{schema:"storyhub" } )
export  class Manager {

@Column("int",{ primary:true,name:"id" })
id:number;

@OneToMany(()=>Genre,genre=>genre.creator)


genres:Genre[];

@OneToOne(()=>User,user=>user.manager,{ onDelete:"NO ACTION",onUpdate:"NO ACTION" })
@JoinColumn([{ name: "id", referencedColumnName: "id" },
])user:User;

@OneToMany(()=>WithdrawRequest,withdrawRequest=>withdrawRequest.processor)


withdrawRequests:WithdrawRequest[];

}
