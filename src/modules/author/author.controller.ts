import { Controller, Get, Param } from "@nestjs/common";
import { AuthorService } from "./author.service";

@Controller('author')
export class AuthorController {
    constructor(
        private readonly authorService: AuthorService
    ) {}

    @Get(':id')
    getSomeAuthorInfo(@Param('id') id: number) {
        return this.authorService.getSomeAuthorInfo(id);
    }

    @Get()
    getAll() {
        return this.authorService.getAll();
    }
}