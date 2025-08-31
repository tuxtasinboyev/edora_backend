import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseMentorDto {
  @ApiProperty({ example: 'clx1l4kf40001s01ozk3m9i6d' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 7 })
  @IsNumber()
  userId: number;
}
