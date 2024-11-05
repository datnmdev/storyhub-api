import {Column,Entity,Index,OneToMany,OneToOne,PrimaryGeneratedColumn} from "typeorm";
import {Reader} from './Reader'
import {Account} from './Account'
import {Author} from './Author'
import {Manager} from './Manager'
import {Moderator} from './Moderator'
import {NotificationUser} from './NotificationUser'
import {Wallet} from './Wallet'


@Index("FTI_name",["name",],{ fulltext:true })
@Entity("user" ,{schema:"storyhub" } )
export  class User {

@PrimaryGeneratedColumn({ type:"int", name:"id" })
id:number;

@Column("varchar",{ name:"name",length:255 })
name:string;

@Column("date",{ name:"dob",nullable:true })
dob:string | null;

@Column("int",{ name:"gender",nullable:true,comment:"- gender (giới tính) có các giá trị và ý nghĩa tương ứng là:\n+ 0: Nam\n+ 1: Nữ\n+ 2: Khác" })
gender:number | null;

@Column("varchar",{ name:"phone",nullable:true,length:20 })
phone:string | null;

@Column("longtext",{ name:"avatar",nullable:true })
avatar:string | null;

@Column("int",{ name:"type",comment:"- type là loại người dùng bao gồm các giá trị và ý nghĩa tương ứng là:\r\n+ 0: manager (người quản lý)\r\n+ 1: moderator (kiểm duyệt viên)\r\n+ 2: author (tác giả)\r\n+ 3: reader (độc giả)",default: () => "'3'", })
type:number;

@Column("datetime",{ name:"created_at",default: () => "CURRENT_TIMESTAMP", })
createdAt:Date;

@Column("datetime",{ name:"updated_at",default: () => "CURRENT_TIMESTAMP", })
updatedAt:Date;

@OneToOne(()=>Reader,reader=>reader.id)reader:Reader;

@OneToOne(()=>Account,account=>account.id)account:Account;

@OneToOne(()=>Author,author=>author.id)author:Author;

@OneToOne(()=>Manager,manager=>manager.id)manager:Manager;

@OneToOne(()=>Moderator,moderator=>moderator.id)moderator:Moderator;

@OneToMany(()=>NotificationUser,notificationUser=>notificationUser.receiver)
notificationUsers:NotificationUser[];

@OneToOne(()=>Wallet,wallet=>wallet.id)wallet:Wallet;

}
