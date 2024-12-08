import { IsNotEmpty, IsString } from "class-validator";

export class CheckCccdDto {
    @IsNotEmpty()
    @IsString()
    cccd: string
}