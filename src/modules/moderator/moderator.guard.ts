import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "@/@types/express";
import { DataSource } from "typeorm";
import { Moderator } from "./entities/moderator.entity";
import { UpdateModeratorDto } from "./dto/update-moderator.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class EmployeeManagementRoleGuard implements CanActivate {
    constructor(
        private readonly dataSource: DataSource
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const user: User = context.switchToHttp().getRequest().user;
        const updateModeratorDto = plainToInstance(UpdateModeratorDto, context.switchToHttp().getRequest().body);
        const errors = await validate(updateModeratorDto);
        if (errors.length > 0) {
            return false;
        }
        const moderator = await this.dataSource.manager.findOne(Moderator, {
            where: {
                managerId: user.userId,
                id: updateModeratorDto?.id
            }
        })
        if (moderator) {
            return true;
        }
        return false;
    }
}