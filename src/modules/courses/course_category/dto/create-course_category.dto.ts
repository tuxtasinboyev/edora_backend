import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseCategoryDto {
  @ApiProperty({ example: 'Frontend Development' })
  @IsString()
  name: string;
}
