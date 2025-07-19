import { IsNotEmpty, IsString } from "class-validator"

export class CreateLessonsFileDto {
    @IsString()
    note: string
    
    @IsNotEmpty()
    @IsString()
    lessonId: string
}
