import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Alias } from "./Alias";
import { Chapter } from "./Chapter";
import { Comment } from "./Comment";
import { FollowDetail } from "./FollowDetail";
import { Genre } from "./Genre";
import { ModerationRequest } from "./ModerationRequest";
import { Price } from "./Price";
import { RatingDetail } from "./RatingDetail";
import { Author } from "./Author";
import { Country } from "./Country";

@Index("FK_story_country_idx", ["countryId"], {})
@Index("FK_story_author_idx", ["authorId"], {})
@Index("FTI_title", ["title"], { fulltext: true })
@Entity("story", { schema: "storyhub" })
export class Story {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "title" })
  title: string;

  @Column("longtext", { name: "description" })
  description: string;

  @Column("longtext", { name: "note", nullable: true })
  note: string | null;

  @Column("longtext", { name: "cover_image" })
  coverImage: string;

  @Column("int", {
    name: "type",
    comment:
      "- type là loại truyện bao gồm các giá trị và ý nghĩa tương ứng là:\n+ 0: Loại truyện chữ\n+ 1: Loại truyện tranh",
  })
  type: number;

  @Column("int", {
    name: "status",
    comment:
      "status là trạng thái của bộ truyện bao gồm các giá trị và ý nghĩa tương ứng là:\n+ 0: Chưa phát hành\n+ 1: Chờ phát hành\n+ 2: Đang phát hành\n+ 3: Tạm hoãn\n+ 4: Hoàn thành\n+ 5: Ẩn\n+ 6: Đã xoá",
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

  @Column("int", { name: "country_id" })
  countryId: number;

  @Column("int", { name: "author_id" })
  authorId: number;

  @OneToMany(() => Alias, (alias) => alias.story)
  aliases: Alias[];

  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters: Chapter[];

  @OneToMany(() => Comment, (comment) => comment.story)
  comments: Comment[];

  @OneToMany(() => FollowDetail, (followDetail) => followDetail.story)
  followDetails: FollowDetail[];

  @ManyToMany(() => Genre, (genre) => genre.stories)
  genres: Genre[];

  @OneToMany(
    () => ModerationRequest,
    (moderationRequest) => moderationRequest.story
  )
  moderationRequests: ModerationRequest[];

  @OneToMany(() => Price, (price) => price.story)
  prices: Price[];

  @OneToMany(() => RatingDetail, (ratingDetail) => ratingDetail.story)
  ratingDetails: RatingDetail[];

  @ManyToOne(() => Author, (author) => author.stories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "author_id", referencedColumnName: "id" }])
  author: Author;

  @ManyToOne(() => Country, (country) => country.stories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "country_id", referencedColumnName: "id" }])
  country: Country;
}
