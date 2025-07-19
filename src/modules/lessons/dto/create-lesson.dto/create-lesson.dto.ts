import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateLessonDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    about: string

    @IsNumber()
    groupId?: number

    @IsDateString()
    updatedAt?: Date

    @IsString()
    courseId?: string
}
