import { Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowDetail } from "./entities/follow-detail.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FollowDetail
        ])
    ],
    controllers: [
        FollowController
    ],
    providers: [
        FollowService
    ]
})
export class FollowModule {}