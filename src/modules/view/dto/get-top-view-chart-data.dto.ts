import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class GetTopViewChartDataDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsInt()
    atTime: number
}