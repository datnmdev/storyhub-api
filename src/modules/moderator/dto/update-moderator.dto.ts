import { ModeratorStatus } from "@/common/constants/moderator.constants";
import { Gender } from "@/common/constants/user.constants";
import { OneOf } from "@/common/decorators/validation.decorator";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import moment from "moment";

export class UpdateModeratorDto {
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
	@IsInt()
	id: number;

    @IsString()
    @Matches(/^[0-9]{12}$/)
    cccd: string

    @IsOptional()
	@IsString()
	@MinLength(1)
	name: string;

    @Transform(({ value }) => {
        const momentDate = moment(value, "YYYY-MM-DD", true);
        if (momentDate.isValid()) {
            return momentDate.toDate();
        }
        return value;
    })
    @IsOptional()
	@IsDate()
	dob: Date;

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    @OneOf([
        Gender.MALE,
        Gender.FEMALE,
        Gender.ORTHER,
    ])
    gender: number

    @IsOptional()
	@IsString()
	@Matches((/^[0-9]{10,11}$/))
	phone: string;

    @IsOptional()
	@IsString()
	@MinLength(1)
	address: string;

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    @OneOf([
        ModeratorStatus.WORKING,
        ModeratorStatus.RESIGNED
    ])
    status: number

    @Transform(({ value }) => {
        const momentDate = moment(value, "YYYY-MM-DD", true);
        if (momentDate.isValid()) {
            return momentDate.toDate();
        }
        return value;
    })
    @IsOptional()
	@IsDate()
	doj: Date;

    @IsOptional()
	@IsString()
	avatar: string;
}

@Exclude()
export class UpdateUserDataDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    @Transform(({ value }) => {
        const momentDate = moment(value, "YYYY-MM-DD", true);
        if (momentDate.isValid()) {
            return momentDate.toDate();
        }
        return value;
    })
    dob: Date;

    @Expose()
    gender: number;

    @Expose()
    phone: string;

    @Expose()
    avatar: string;
}

@Exclude()
export class UpdateModeratorDataDto {
    @Expose()
    cccd: string;

    @Expose()
    address: string;

    @Expose()
    status: number;

    @Expose()
    @Transform(({ value }) => {
        const momentDate = moment(value, "YYYY-MM-DD", true);
        if (momentDate.isValid()) {
            return momentDate.toDate();
        }
        return value;
    })
    doj: Date;
}