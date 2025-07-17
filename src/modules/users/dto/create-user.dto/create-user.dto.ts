import { UserRole } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    phone: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    fullName: string
}
