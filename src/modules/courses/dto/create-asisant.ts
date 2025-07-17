import { IsNumber, IsString } from "class-validator";

export class CreateAssisantDto {
    @IsNumber()
    assistantId: number
    @IsString()
    courseId: string
}