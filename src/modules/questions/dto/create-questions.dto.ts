import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is the difference between let and var in JavaScript?' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class UpdateQuestionDto {
  @ApiPropertyOptional({ example: 'Updated question text here' })
  @IsString()
  @IsOptional()
  text?: string;
}
