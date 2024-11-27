import { User } from "@/common/decorators/user.decorator";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/constants/account.constants";
import { RolesGuard } from "@/common/guards/roles.guard";

@Controller('wallet')
@Roles(Role.READER, Role.AUTHOR)
@UseGuards(RolesGuard)    
export class WalletController {
    constructor(
        private readonly walletService: WalletService
    ) {}

    @Get()
    getWallet(@User('userId') userId: number) {
        return this.walletService.findWalletBy(userId);
    }
}