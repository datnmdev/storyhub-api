import { IsNotEmpty, IsString } from "class-validator";

export class GetTokenAfterOAuth2Dto {
    @IsNotEmpty()
    @IsString()
    state: string
}