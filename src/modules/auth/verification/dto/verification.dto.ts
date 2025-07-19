import { IsEnum, IsString } from "class-validator";
import { EVeriification } from "src/common/utils/helper/helper";

export class SendOtpDto {
    @IsEnum(EVeriification)
    type: EVeriification

    @IsString()
    phone: string
}
export class VerifyOtpDto extends SendOtpDto {
    otp: string
}