import { IsString, Length, Matches } from 'class-validator';

export class UpdatePhoneDto {
    @IsString()
    @Matches(/^\d{9,15}$/)
    phone: string;

    @IsString()
    otp: string;
}
