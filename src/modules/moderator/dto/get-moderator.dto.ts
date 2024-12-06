import { Pagination } from "@/common/class/pagination.class"
import { ModeratorStatus } from "@/common/constants/moderator.constants"
import { Gender } from "@/common/constants/user.constants"
import { JsonToObject } from "@/common/decorators/transform.decorator"
import { ArrayElementsIn } from "@/common/decorators/validation.decorator"
import { Transform } from "class-transformer"
import { IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator"

export class GetModeratorDto extends Pagination {
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    id?: number

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    cccd?: string

    @JsonToObject()
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayElementsIn([
        Gender.MALE,
        Gender.FEMALE,
        Gender.ORTHER,
    ])
    gender: number[]

    @JsonToObject()
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayElementsIn([
        ModeratorStatus.WORKING,
        ModeratorStatus.RESIGNED
    ])
    statuses: number[]

    @IsOptional()
    @IsString()
    keyword?: string
}