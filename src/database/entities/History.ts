import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chapter } from "./Chapter";
import { Reader } from "./Reader";

@Index("FK_history_reader_idx", ["readerId"], {})
@Index("FK_history_chapter_idx", ["chapterId"], {})
@Entity("history", { schema: "storyhub" })
export class History {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "position" })
  position: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("int", { name: "reader_id" })
  readerId: number;

  @Column("int", { name: "chapter_id" })
  chapterId: number;

  @ManyToOne(() => Chapter, (chapter) => chapter.histories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "chapter_id", referencedColumnName: "id" }])
  chapter: Chapter;

  @ManyToOne(() => Reader, (reader) => reader.histories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "reader_id", referencedColumnName: "id" }])
  reader: Reader;
}
