import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { GetInvoiceDto } from "./dto/get-invoice.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/constants/account.constants";
import { RolesGuard } from "@/common/guards/roles.guard";
import { User } from "@/common/decorators/user.decorator";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";

@Controller('invoice')
export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceService
    ) {}

    @Get()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    getInvoice(@User('userId') userId: number, @Query() getInvoiceDto: GetInvoiceDto) {
        return this.invoiceService.getInvoice(userId, getInvoiceDto);
    }

    @Post()
    @Roles(Role.READER)
    @UseGuards(RolesGuard)
    createInvoice(@User('userId') userId: number, @Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoiceService.createInvoiceBy(userId, createInvoiceDto.chapterId);
    }
}