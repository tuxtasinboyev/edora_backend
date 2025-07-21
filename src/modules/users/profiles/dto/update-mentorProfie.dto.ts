import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMentorProfileDto {
  @ApiProperty({ example: 3, description: 'Mentor tajribasi yillarda' })
  @IsInt()
  @Min(0)
  experience: number;

  @ApiProperty({ example: 'Software Developer', description: 'Mentor ish joyi yoki kasbi' })
  @IsString()
  job: string;

  @ApiProperty({ example: 'I am passionate about teaching.', description: 'Mentor haqida qisqacha ma’lumot' })
  @IsString()
  about: string;

  @ApiPropertyOptional({ example: 'https://t.me/mentor', description: 'Telegram profili' })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/mentor', description: 'Facebook profili' })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/mentor', description: 'Instagram profili' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/mentor', description: 'LinkedIn profili' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://github.com/mentor', description: 'GitHub profili' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ example: 'https://mentorwebsite.com', description: 'Shaxsiy sayt' })
  @IsOptional()
  @IsString()
  website?: string;
}
