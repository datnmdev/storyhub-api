import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Notification } from "./Notification";
import { Author } from "./Author";
import { Manager } from "./Manager";

@Index("FK_withdrawRequest_author_idx", ["requesterId"], {})
@Index("FK_withdrawRequest_manager_idx", ["processorId"], {})
@Entity("withdraw_request", { schema: "storyhub" })
export class WithdrawRequest {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("decimal", { name: "amount", precision: 18, scale: 0 })
  amount: string;

  @Column("int", {
    name: "status",
    comment:
      "- status có các giá trị và ý nghĩa tương ứng là:\n+ 0: Chờ xử lý\n+ 1: Thành công\n+ 2: Thất bại",
  })
  status: number;

  @Column("datetime", {
    name: "request_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  requestDate: Date;

  @Column("datetime", { name: "process_date", nullable: true })
  processDate: Date | null;

  @Column("longtext", { name: "note", nullable: true })
  note: string | null;

  @Column("int", {
    name: "requester_id",
    comment: "requester_id là id của tác giả yêu cầu rút tiền",
  })
  requesterId: number;

  @Column("int", {
    name: "processor_id",
    comment: "processor_id là id của người quản lý xử lý yêu cầu rút tiền",
  })
  processorId: number;

  @OneToMany(() => Notification, (notification) => notification.withdrawRequest)
  notifications: Notification[];

  @ManyToOne(() => Author, (author) => author.withdrawRequests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "requester_id", referencedColumnName: "id" }])
  requester: Author;

  @ManyToOne(() => Manager, (manager) => manager.withdrawRequests, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "processor_id", referencedColumnName: "id" }])
  processor: Manager;
}
