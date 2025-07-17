import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateMentorProfileDto {
    @IsInt()
    experience: number;

    @IsString()
    job: string;

    @IsString()
    about: string;

    @IsOptional()
    @IsString()
    telegram?: string;

    @IsOptional()
    @IsString()
    facebook?: string;

    @IsOptional()
    @IsString()
    instagram?: string;

    @IsOptional()
    @IsString()
    linkedin?: string;

    @IsOptional()
    @IsString()
    github?: string;

    @IsOptional()
    @IsString()
    website?: string;
}
