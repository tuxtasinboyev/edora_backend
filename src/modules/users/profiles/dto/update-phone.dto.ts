import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhoneDto {
  @ApiProperty({
    description: 'Eski telefon raqam',
    example: '+998901234567',
  })
  @IsString()
  oldPhone: string;

  @ApiProperty({
    description: 'Yangi telefon raqam',
    example: '+998901234568',
  })
  @IsString()
  newPhone: string;
}
