import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsInt,
  IsUrl,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateMentorDto {
  @ApiProperty({ example: '+998901234567', description: 'Telefon raqam (UZ)' })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Ali Valiyev', description: 'To‘liq ism' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'securePassword123', description: 'Parol' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 5, description: 'Ish tajribasi (yillar)' })
  @IsInt()
  @Min(0)
  experience: number;

  @ApiProperty({ example: 'Frontend Developer', description: 'Kasbi' })
  @IsString()
  @IsNotEmpty()
  job: string;

  @ApiPropertyOptional({ example: 'I am a passionate developer.', description: 'Haqqimda' })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({ example: 'https://t.me/username', description: 'Telegram URL' })
  @IsUrl()
  @IsOptional()
  telegram?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/username', description: 'Facebook URL' })
  @IsUrl()
  @IsOptional()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/username', description: 'Instagram URL' })
  @IsUrl()
  @IsOptional()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/username', description: 'LinkedIn URL' })
  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username', description: 'GitHub URL' })
  @IsUrl()
  @IsOptional()
  github?: string;

  @ApiPropertyOptional({ example: 'https://mywebsite.com', description: 'Shaxsiy sayt URL' })
  @IsUrl()
  @IsOptional()
  website?: string;
}
