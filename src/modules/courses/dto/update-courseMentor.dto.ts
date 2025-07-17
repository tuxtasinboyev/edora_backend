import { IsNumber, IsString } from "class-validator"

export class UpdateCourseMentorDto {
    @IsString()
    courseId: string
    @IsNumber()
    userId: number
}