import { Module } from "@nestjs/common";
import { ModeratorController } from "./moderator.controller";
import { ModeratorService } from "./moderator.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Moderator } from "./entities/moderator.entity";
import { EmployeeManagementRoleGuard } from "./moderator.guard";
import { BullModule } from "@/common/bull/bull.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Moderator
        ]),
        BullModule
    ],
    controllers: [
        ModeratorController
    ],
    providers: [
        ModeratorService,
        EmployeeManagementRoleGuard
    ]
})
export class ModeratorModule {}