import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Story } from "./Story";

@Index("FK_price_story_idx", ["storyId"], {})
@Entity("price", { schema: "storyhub" })
export class Price {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("decimal", { name: "amount", precision: 18, scale: 0 })
  amount: string;

  @Column("datetime", { name: "start_time" })
  startTime: Date;

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

  @ManyToOne(() => Story, (story) => story.prices, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "story_id", referencedColumnName: "id" }])
  story: Story;
}
