import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Comment } from './Comment';
import { Reader } from './Reader';

@Index('FK_commentInteraction_comment_idx', ['commentId'], {})
@Entity('comment_interaction', { schema: 'storyhub' })
export class CommentInteraction {
	@Column('int', { primary: true, name: 'reader_id' })
	readerId: number;

	@Column('int', { primary: true, name: 'comment_id' })
	commentId: number;

	@Column('int', {
		name: 'interaction_type',
		comment:
			'interaction_type là loại tương tác của độc giả với bình luận bao gồm các giá trị và ý nghĩa tương ứng là:\n+ 0: like (thích)\n+ 1: dislike (không thích)',
	})
	interactionType: number;

	@ManyToOne(() => Comment, (comment) => comment.commentInteractions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
	comment: Comment;

	@ManyToOne(() => Reader, (reader) => reader.commentInteractions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'reader_id', referencedColumnName: 'id' }])
	reader: Reader;
}
