import { IsEnum, IsString } from 'class-validator';
import { EVeriification } from 'src/common/utils/helper/helper';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ enum: EVeriification })
  @IsEnum(EVeriification)
  type: EVeriification;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string;
}

export class VerifyOtpDto extends SendOtpDto {
  @ApiProperty({ example: '1234' })
  otp: string;
}
