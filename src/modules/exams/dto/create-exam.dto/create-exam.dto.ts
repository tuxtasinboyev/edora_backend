import { ExamAnswer } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, IsIn, ArrayNotEmpty, IsNumber, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';

export class AnswerDto {
    @IsInt()
    id: number;

    @IsString()
    @IsIn(['variantA', 'variantB', 'variantC', 'variantD'])
    answer: string;
}

export class PassExamDto {
    @IsInt()
    lessonGroupId: number;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[];
}


export class CreateExamDto {
    @IsString()
    question: string;

    @IsNumber()
    lessonGroupId: number;

    @IsString()
    variantA: string;

    @IsString()
    variantB: string;

    @IsString()
    variantC: string;

    @IsString()
    variantD: string;

    @IsString()
    @IsEnum(ExamAnswer)
    answer: ExamAnswer
}
export class CreateManyExamDto {
    @IsNumber()
    lessonGroupId: number;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateExamDto)
    exams: CreateExamDto[]
}

