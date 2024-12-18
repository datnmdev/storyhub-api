import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./entities/comment.entity";
import { DeleteCommentGuard, UpdateCommentGuard } from "./comment.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Comment
        ])
    ],
    controllers: [
        CommentController
    ],
    providers: [
        CommentService
    ]
})
export class CommentModule {}