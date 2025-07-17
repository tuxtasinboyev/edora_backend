import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateLastActivtyDto {
    @IsOptional()
    @IsString()
    courseId?: string;

    @IsOptional()
    @IsNumber()
    groupId?: number;

    @IsOptional()
    @IsString()
    lessonId?: string;

    @IsOptional()
    @IsString()
    url?: string;
}
