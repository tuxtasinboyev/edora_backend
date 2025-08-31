import { PartialType } from '@nestjs/swagger';
import { CreateLessonsFileDto } from './create-lessons-file.dto';

export class UpdateLessonsFileDto extends PartialType(CreateLessonsFileDto) {}
