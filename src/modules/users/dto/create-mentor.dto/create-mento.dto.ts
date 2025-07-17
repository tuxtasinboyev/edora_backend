import { IsString, IsNotEmpty, IsPhoneNumber, IsInt, IsUrl, IsOptional, Min } from 'class-validator';

export class CreateMentorDto {
    @IsPhoneNumber('UZ')
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsInt()
    @Min(0)
    experience: number;

    @IsString()
    @IsNotEmpty()
    job: string;

    @IsString()
    @IsOptional()
    about?: string;

    @IsUrl()
    @IsOptional()
    telegram?: string;

    @IsUrl()
    @IsOptional()
    facebook?: string;

    @IsUrl()
    @IsOptional()
    instagram?: string;

    @IsUrl()
    @IsOptional()
    linkedin?: string;

    @IsUrl()
    @IsOptional()
    github?: string;

    @IsUrl()
    @IsOptional()
    website?: string;
}

