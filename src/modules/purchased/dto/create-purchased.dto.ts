import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class PurchaseCourseDto {
    @ApiProperty({ example: 'course_abc123' })
    @IsString()
    courseId: string;
}

export class CreatePurchasedCourseDto {
    @ApiProperty({ example: 'course_12345', description: 'Course ID' })
    @IsString()
    courseId: string;

    @ApiProperty({ example: '+998902400005', description: 'Student phone number' })
    @IsString()
    @Matches(/^\+998\d{9}$/, { message: 'Phone number must match Uzbek format' })
    phone: string;
}
