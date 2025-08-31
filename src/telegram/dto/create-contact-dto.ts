import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the contact person' })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty({ example: '+998901234567', description: 'Contact phone number' })
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty({ example: 'I want to know more about your services.', description: 'Message from the contact person' })
    @IsNotEmpty()
    @IsString()
    message: string;
}
