import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ example: 'course_123456', description: 'Course ID to purchase' })
  @IsString()
  courseId: string;
}
