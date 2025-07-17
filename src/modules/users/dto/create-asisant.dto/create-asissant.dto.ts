import { UserRole } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
export class CreateAsisant {
    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    fullName: string
    @IsNotEmpty()
    @IsString()
    courseId:string
}
