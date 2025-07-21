import { IsString, IsOptional, IsUrl, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMentorDto {
  @ApiPropertyOptional({ example: '+998902400025' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Adminov Adminjon' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @ApiPropertyOptional({ example: 'Full-stack software engineer' })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiPropertyOptional({ example: 'About me text' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ example: 'https://t.me/username' })
  @IsOptional()
  @IsUrl()
  telegram?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/username' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/username' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username' })
  @IsOptional()
  @IsUrl()
  github?: string;

  @ApiPropertyOptional({ example: 'https://mywebsite.com' })
  @IsOptional()
  @IsUrl()
  website?: string;
}
