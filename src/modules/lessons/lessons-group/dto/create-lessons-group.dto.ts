import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonsGroupDto {
  @ApiProperty({ example: 'Week 1 - Introduction' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'clx1l4kf40001s01ozk3m9i6d' })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
