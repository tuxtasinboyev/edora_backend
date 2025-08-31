import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLastActivtyDto {
  @ApiPropertyOptional({ type: String, description: 'Course ID' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ type: Number, description: 'Group ID' })
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @ApiPropertyOptional({ type: String, description: 'Lesson ID' })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({ type: String, description: 'URL' })
  @IsOptional()
  @IsString()
  url?: string;
}
