import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ModeratorService } from "./moderator.service";
import { GetModeratorDto } from "./dto/get-moderator.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/constants/account.constants";
import { RolesGuard } from "@/common/guards/roles.guard";
import { CreateModeratorDto } from "./dto/create-moderator.dto";
import { User } from "@/common/decorators/user.decorator";
import { CheckCccdDto } from "./dto/check-cccd.dto";

@Controller('moderator')
export class ModeratorController {
    constructor(
        private readonly moderatorService: ModeratorService
    ) {}

    @Get('/check-cccd')
    checkCccd(@Query() checkCccdDto: CheckCccdDto) {
        return this.moderatorService.isCccdExisted(checkCccdDto.cccd);
    }

    @Get()
    @Roles(Role.MANAGER)
    @UseGuards(RolesGuard)
    getModerators(@Query() getModeratorDto: GetModeratorDto) {
        return this.moderatorService.getModeratorWithFilter(getModeratorDto);
    }

    @Post()
    @Roles(Role.MANAGER)
    @UseGuards(RolesGuard)
    createModerator(@User('userId') userId: number, @Body() createModeratorDto: CreateModeratorDto) {
        return this.moderatorService.createModerator(userId, createModeratorDto);
    }
}