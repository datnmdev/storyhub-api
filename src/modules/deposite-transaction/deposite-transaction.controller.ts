import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { DepositeTransactionService } from "./deposite-transaction.service";
import { CreatePaymentUrlDto } from "./dto/create-payment-url.dto";
import { Request, Response } from "express";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/constants/account.constants";
import { HandleVnpayIpnDto } from "./dto/handle-vnpay-ipn.dto";
import { GetPaymentStatusDto } from "./dto/get-payment-status.dto";
import { User } from "@/common/decorators/user.decorator";
import { GetDepositeTransHistoryDto } from "./dto/get-deposite-transaction-history.dto";

@Controller('deposite-transaction')
export class DepositeTransactionController {
    constructor(
        private readonly depositeTransactionService: DepositeTransactionService
    ) { }

    @Post('create-payment-url')
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    createPaymentUrl(
        @Req() req: Request,
        @Body() createPaymentUrlDto: CreatePaymentUrlDto
    ) {
        return this.depositeTransactionService.createPaymentUrl(req, createPaymentUrlDto);
    }

    @Get('vnpay-ipn')
    handleVnpayIpn(
        @Query() handleVnpayIpnDto: HandleVnpayIpnDto,
        @Res() res: Response
    ) {
        return res.status(200).json(this.depositeTransactionService.handleVnpIpn(handleVnpayIpnDto));
    }

    @Get('vnpay-return')
    handleVnpayReturn() {
        return this.depositeTransactionService.handleVnpReturn();
    }

    @Get('get-payment-status')
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    getPaymentStatus(@Query() getPaymentStatusDto: GetPaymentStatusDto) {
        return this.depositeTransactionService.getPaymentStatus(getPaymentStatusDto);
    }

    @Get('get-deposite-transaction-history')
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    getDepositeTransHistory(@User('userId') userId: number, @Query() getDepositeTransHistoryDto: GetDepositeTransHistoryDto) {
        return this.depositeTransactionService.getDepositeTransHistory(userId, getDepositeTransHistoryDto);
    }
}