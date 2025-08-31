import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Current password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'newStrongPassword456', description: 'New password' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
