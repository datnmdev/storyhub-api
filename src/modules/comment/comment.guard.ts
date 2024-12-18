import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { DataSource } from "typeorm";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class UpdateCommentGuard implements CanActivate {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        if (typeof req.body.id == 'number') {
            const comment = await this.dataSource
                .createQueryBuilder(Comment, 'comment')
                .where('comment.id = :id', {
                    id: req.body.id
                })
                .getOne();
            if (comment.readerId === req.user.userId) {
                return true;
            }
        }
        return false;
    }
}

@Injectable()
export class DeleteCommentGuard implements CanActivate {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        if (!isNaN(Number(req.params.id))) {
            const comment = await this.dataSource
                .createQueryBuilder(Comment, 'comment')
                .where('comment.id = :id', {
                    id: Number(req.params.id)
                })
                .getOne();
            if (comment.readerId === req.user.userId) {
                return true;
            }
        }
        return false;
    }
}