import { CourseLevel } from "@prisma/client";
import { IsBoolean, IsDecimal, IsEnum, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    name: string

    @IsString()
    about: string

    @IsDecimal()
    price: string

    @IsString()
    @IsEnum(CourseLevel)
    level: CourseLevel

    @IsNumber()
    categoryId: number

    @IsBoolean()
    published: boolean

    @IsNumber()
    mentorId: number
}
