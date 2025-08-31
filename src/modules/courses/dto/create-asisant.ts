import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssisantDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  assistantId: number;

  @ApiProperty({ example: 'clx1l4kf40001s01ozk3m9i6d' })
  @IsString()
  courseId: string;
}
