import { PartialType } from '@nestjs/swagger';
import { CreateLessonsGroupDto } from './create-lessons-group.dto';

export class UpdateLessonsGroupDto extends PartialType(CreateLessonsGroupDto) {}
