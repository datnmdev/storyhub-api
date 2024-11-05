import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { CommentInteraction } from "./CommentInteraction";
import { DepositeTransaction } from "./DepositeTransaction";
import { FollowDetail } from "./FollowDetail";
import { History } from "./History";
import { Invoice } from "./Invoice";
import { RatingDetail } from "./RatingDetail";

@Entity("Reader", { schema: "storyhub" })
export class Reader {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @OneToOne(() => User, (user) => user.reader, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id", referencedColumnName: "id" }])
  user: User;

  @OneToMany(() => Comment, (comment) => comment.reader)
  comments: Comment[];

  @OneToMany(
    () => CommentInteraction,
    (commentInteraction) => commentInteraction.reader
  )
  commentInteractions: CommentInteraction[];

  @OneToMany(
    () => DepositeTransaction,
    (depositeTransaction) => depositeTransaction.reader
  )
  depositeTransactions: DepositeTransaction[];

  @OneToMany(() => FollowDetail, (followDetail) => followDetail.reader)
  followDetails: FollowDetail[];

  @OneToMany(() => History, (history) => history.reader)
  histories: History[];

  @OneToMany(() => Invoice, (invoice) => invoice.reader)
  invoices: Invoice[];

  @OneToMany(() => RatingDetail, (ratingDetail) => ratingDetail.reader)
  ratingDetails: RatingDetail[];
}
