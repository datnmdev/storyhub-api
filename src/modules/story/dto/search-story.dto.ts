import { IsNotEmpty, IsString } from "class-validator";

export class SearchStoryDto {
    @IsString()
    keyword: string
}