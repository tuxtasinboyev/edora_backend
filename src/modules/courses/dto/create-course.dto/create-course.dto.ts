import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDecimal,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ example: 'JavaScript for Beginners' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Learn the basics of JavaScript programming' })
  @IsString()
  about: string;

  @ApiProperty({ example: '49.99' })
  @IsDecimal()
  price: string;

  @ApiProperty({ enum: CourseLevel, example: CourseLevel.BEGINNER })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  @ApiProperty({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  published: boolean;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsNumber()
  mentorId: number;
}
