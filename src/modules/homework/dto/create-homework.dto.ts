import { HomeworkSubStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'Create a portfolio website using HTML/CSS/JS' })
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty({ example: 'clx1l4kf40001s01ozk3m9i6d' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}

export class CreateHomeworkSubmissionDto {
  @ApiPropertyOptional({ example: 'My solution includes a responsive layout and animations.' })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ example: 'Did not complete due to illness.' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class CheckAproved {
  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsNotEmpty()
  submissionId: number;

  @ApiProperty({ enum: HomeworkSubStatus, example: HomeworkSubStatus.APPROVED })
  @IsString()
  @IsNotEmpty()
  @IsEnum(HomeworkSubStatus)
  approved: HomeworkSubStatus;

  @ApiProperty({ example: 'Well done, approved!' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
