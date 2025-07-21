import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhoneDto {
  @ApiProperty({
    description: 'Yangi telefon raqam (faqat raqamlar, 9 dan 15 gacha uzunlikda)',
    example: '998901234567',
  })
  @IsString()
  @Matches(/^\d{9,15}$/, {
    message: 'Phone must contain only digits and be between 9 and 15 characters long',
  })
  phone: string;

  @ApiProperty({
    description: 'OTP kodi (bir martalik tasdiqlash kodi)',
    example: '123456',
  })
  @IsString()
  otp: string;
}
