import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  IsIn,
  ArrayNotEmpty,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'variantA', enum: ['variantA', 'variantB', 'variantC', 'variantD'] })
  @IsString()
  @IsIn(['variantA', 'variantB', 'variantC', 'variantD'])
  answer: string;
}

export class PassExamDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  lessonGroupId: number;

  @ApiProperty({ type: [AnswerDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class CreateExamDto {
  @ApiProperty({ example: 'What is 2 + 2?' })
  @IsString()
  question: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  lessonGroupId: number;

  @ApiProperty({ example: '2' })
  @IsString()
  variantA: string;

  @ApiProperty({ example: '3' })
  @IsString()
  variantB: string;

  @ApiProperty({ example: '4' })
  @IsString()
  variantC: string;

  @ApiProperty({ example: '5' })
  @IsString()
  variantD: string;

  @ApiProperty({ example: 'variantC', enum: ExamAnswer })
  @IsString()
  @IsEnum(ExamAnswer)
  answer: ExamAnswer;
}

export class CreateManyExamDto {
  @ApiProperty({ example: 7 })
  @IsNumber()
  lessonGroupId: number;

  @ApiProperty({ type: [CreateExamDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateExamDto)
  exams: CreateExamDto[];
}
