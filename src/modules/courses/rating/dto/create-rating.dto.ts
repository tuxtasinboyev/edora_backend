import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  rating: number;

  @ApiProperty({ example: 'Ajoyib kurs, hammasi tushunarli!' })
  @IsString()
  comment: string;

  @ApiProperty({ example: 'clx1l4kf40001s01ozk3m9i6d' })
  @IsString()
  courseId: string;
}
