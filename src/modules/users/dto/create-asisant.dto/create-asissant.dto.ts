import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAsisant {
  @ApiProperty({ example: '+998901234567', description: 'Assistant phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Assistant password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Assistant full name' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'courseId123', description: 'ID of the course' })
  @IsNotEmpty()
  @IsString()
  courseId: string;
}
