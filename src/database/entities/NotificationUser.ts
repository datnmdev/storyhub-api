import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Notification } from "./Notification";
import { User } from "./User";

@Index("FK_notificationUser_user_idx", ["receiverId"], {})
@Index("FK_notificationUser_notification_idx", ["notificationId"], {})
@Entity("notification_user", { schema: "storyhub" })
export class NotificationUser {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", {
    name: "status",
    comment:
      "- status là trạng thái của người dùng đối với thông báo bao gồm cá giá trị và ý nghĩa tương ứng là:\n+ 0: Đã nhận\n+ 1: Đã xem",
  })
  status: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column("int", {
    name: "receiver_id",
    comment: "- receiver là người nhận thông báo",
  })
  receiverId: number;

  @Column("int", { name: "notification_id" })
  notificationId: number;

  @ManyToOne(
    () => Notification,
    (notification) => notification.notificationUsers,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "notification_id", referencedColumnName: "id" }])
  notification: Notification;

  @ManyToOne(() => User, (user) => user.notificationUsers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "receiver_id", referencedColumnName: "id" }])
  receiver: User;
}
