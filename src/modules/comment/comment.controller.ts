import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { User } from "@/common/decorators/user.decorator";
import { GetCommentWithFilterDto } from "./dto/get-comment-with-filter.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { DeleteCommentGuard, UpdateCommentGuard } from "./comment.guard";
import { DeleteCommentDto } from "./dto/delete-comment.dto";

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Get()
    getCommentWithFilter(@Query() getCommentWithFilterDto: GetCommentWithFilterDto) {
        return this.commentService.getCommentWithFilter(getCommentWithFilterDto);
    }

    @Post()
    createComment(@User('userId') userId: number, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.createComment(userId, createCommentDto);
    }

    @Put()
    @UseGuards(UpdateCommentGuard)
    updateComment(@Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.updateComment(updateCommentDto.id, updateCommentDto.content);
    }

    @Delete(':id')
    @UseGuards(DeleteCommentGuard)
    deleteComment(@Param() deleteCommentDto: DeleteCommentDto) {
        return this.commentService.deleteComment(deleteCommentDto.id);
    }
}