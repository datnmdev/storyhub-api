import { Module } from "@nestjs/common";
import { ViewService } from "./view.service";
import { ViewController } from "./view.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { View } from "./entities/view.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            View
        ])
    ],
    controllers: [
        ViewController
    ],
    providers: [
        ViewService
    ]
})
export class ViewModule { }