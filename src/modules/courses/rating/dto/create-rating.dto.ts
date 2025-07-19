import { IsNumber, IsString } from "class-validator";

export class CreateRatingDto {
    @IsNumber()
    rating: number

    @IsString()
    comment:string

    @IsString()
    courseId:string
}
