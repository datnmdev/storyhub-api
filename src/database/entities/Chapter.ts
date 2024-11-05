import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Story } from "./Story";
import { ChapterImage } from "./ChapterImage";
import { Comment } from "./Comment";
import { History } from "./History";
import { Invoice } from "./Invoice";
import { ModerationRequest } from "./ModerationRequest";
import { View } from "./View";

@Index("FK_chapter_story_idx", ["storyId"], {})
@Index("FTI_name", ["name"], { fulltext: true })
@Entity("chapter", { schema: "storyhub" })
export class Chapter {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "order" })
  order: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("longtext", { name: "content", nullable: true })
  content: string | null;

  @Column("int", {
    name: "status",
    comment:
      "status là trạng thái chuơng bao gồm các giá trị và ý nghĩa tương ứng là:\\n+ 0: Chưa phát hành\\n+ 1: Chờ phát hành\\n+ 2: Đang phát hành\\n+ 3: Tạm hoãn\\n+ 4: Hoàn thành\\n+ 5: Ẩn\\n+ 6: Đã xoá",
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

  @Column("int", { name: "story_id" })
  storyId: number;

  @ManyToOne(() => Story, (story) => story.chapters, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "story_id", referencedColumnName: "id" }])
  story: Story;

  @OneToMany(() => ChapterImage, (chapterImage) => chapterImage.chapter)
  chapterImages: ChapterImage[];

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments: Comment[];

  @OneToMany(() => History, (history) => history.chapter)
  histories: History[];

  @OneToMany(() => Invoice, (invoice) => invoice.chapter)
  invoices: Invoice[];

  @OneToMany(
    () => ModerationRequest,
    (moderationRequest) => moderationRequest.chapter
  )
  moderationRequests: ModerationRequest[];

  @OneToMany(() => View, (view) => view.chapter)
  views: View[];
}
