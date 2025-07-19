import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    password: string;

    @IsString()
    newPassword: string;
}
