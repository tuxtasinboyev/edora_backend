import { UserRole } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
export class RegisterAuthDto {
    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsString()
    otp: string
    
    @IsNotEmpty()
    @IsString()
    fullName: string
}