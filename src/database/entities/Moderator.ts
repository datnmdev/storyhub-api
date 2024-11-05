import {Column,Entity,JoinColumn,OneToMany,OneToOne} from "typeorm";
import {ModerationRequest} from './ModerationRequest'
import {User} from './User'


@Entity("moderator" ,{schema:"storyhub" } )
export  class Moderator {

@Column("int",{ primary:true,name:"id" })
id:number;

@Column("varchar",{ name:"cccd",length:12 })
cccd:string;

@Column("int",{ name:"status",comment:"- status có các giá trị và ý nghĩa tương ứng là:\\n+ 0: Đang làm việc\\n+ 1: Đã nghỉ việc",default: () => "'0'", })
status:number;

@OneToMany(()=>ModerationRequest,moderationRequest=>moderationRequest.responser)


moderationRequests:ModerationRequest[];

@OneToOne(()=>User,user=>user.moderator,{ onDelete:"NO ACTION",onUpdate:"NO ACTION" })
@JoinColumn([{ name: "id", referencedColumnName: "id" },
])user:User;

}
