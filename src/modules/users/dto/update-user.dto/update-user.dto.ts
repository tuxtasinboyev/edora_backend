import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../create-user.dto/create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({ example: '+998901234567', description: 'User phone number' })
    phone?: string;

    @ApiPropertyOptional({ example: 'securePassword123', description: 'User password' })
    password?: string;

    @ApiPropertyOptional({ example: 'Ali Valiyev', description: 'Full name of the user' })
    fullName?: string;
}
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    IsUrl,
    IsPhoneNumber,
    Min,
} from 'class-validator';

export class CreateProfileDto {
    @ApiProperty({ example: '+998902400025' })
    @IsNotEmpty()
    @IsPhoneNumber('UZ') 
    phone: string;

    @ApiProperty({ example: 'Adminov Adminjon' })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    experience: number;

    @ApiProperty({ example: 'Full-stack software engineer' })
    @IsNotEmpty()
    @IsString()
    job: string;

    @ApiProperty({ example: 'About myself...' })
    @IsNotEmpty()
    @IsString()
    about: string;

    @ApiPropertyOptional({ example: 'https://t.me/raupov_manuchehr' })
    @IsOptional()
    @IsUrl()
    telegram?: string;

    @ApiPropertyOptional({ example: 'https://facebook.com/username' })
    @IsOptional()
    @IsUrl()
    facebook?: string;

    @ApiPropertyOptional({ example: 'https://instagram.com/username' })
    @IsOptional()
    @IsUrl()
    instagram?: string;

    @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
    @IsOptional()
    @IsUrl()
    linkedin?: string;

    @ApiPropertyOptional({ example: 'https://github.com/username' })
    @IsOptional()
    @IsUrl()
    github?: string;

    @ApiPropertyOptional({ example: 'https://myportfolio.com' })
    @IsOptional()
    @IsUrl()
    website?: string;
}
