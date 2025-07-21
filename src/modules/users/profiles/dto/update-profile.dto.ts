
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Adminov Adminjon', description: 'Foydalanuvchi to‘liq ismi' })
  @IsOptional() // update uchun optional qilinadi
  @IsString({ message: 'fullName satr (string) bo‘lishi kerak' })
  @MinLength(3, { message: 'fullName kamida 3 ta belgidan iborat bo‘lishi kerak' })
  fullName?: string;
}
