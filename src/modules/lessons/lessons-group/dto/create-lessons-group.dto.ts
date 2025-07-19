import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateLessonsGroupDto {
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    courseId:string
}
