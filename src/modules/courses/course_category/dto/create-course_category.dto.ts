import { IsString } from "class-validator";

export class CreateCourseCategoryDto {
    @IsString()
    name: string
}
