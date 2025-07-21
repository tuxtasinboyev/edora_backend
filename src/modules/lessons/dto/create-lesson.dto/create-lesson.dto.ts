import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 'Introduction to TypeScript' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'This lesson covers the basics of TypeScript.' })
  @IsNotEmpty()
  @IsString()
  about: string;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  groupId?: number;

  @ApiPropertyOptional({ example: '2025-07-20T12:00:00Z' })
  @IsDateString()
  updatedAt?: Date;

  @ApiPropertyOptional({ example: 'clx1l4kf40001s01ozk3m9i6d' })
  @IsString()
  courseId?: string;
}
