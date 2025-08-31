import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonsFileDto {
  @ApiProperty({ example: 'This file contains lecture notes for Lesson 1' })
  @IsString()
  note: string;

  @ApiProperty({ example: 'clx1l4kf40001s01ozk3m9i6d' })
  @IsNotEmpty()
  @IsString()
  lessonId: string;
}
