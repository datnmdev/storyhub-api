import { Gender } from "@/common/constants/user.constants";
import { OneOf } from "@/common/decorators/validation.decorator";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";
import moment from "moment";

export class CreateModeratorDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{12}$/)
    cccd: string

    @IsNotEmpty()
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
    @IsNotEmpty()
	@IsDate()
	dob: Date;

    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    @OneOf([
        Gender.MALE,
        Gender.FEMALE,
        Gender.ORTHER,
    ])
    gender: number

    @IsNotEmpty()
	@IsString()
	@Matches((/^[0-9]{10,11}$/))
	phone: string;

    @IsNotEmpty()
	@IsString()
	@MinLength(1)
	address: string;

    @Transform(({ value }) => {
        const momentDate = moment(value, "YYYY-MM-DD", true);
        if (momentDate.isValid()) {
            return momentDate.toDate();
        }
        return value;
    })
    @IsNotEmpty()
	@IsDate()
	doj: Date;

    @IsOptional()
	@IsString()
	avatar: string;
}

@Exclude()
export class CreateEmailPasswordCredentialDataDto {
    @Expose()
    email: string
}

@Exclude()
export class CreateUserDataDto {
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
export class CreateModeratorDataDto {
    @Expose()
    cccd: string;

    @Expose()
    address: string;

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