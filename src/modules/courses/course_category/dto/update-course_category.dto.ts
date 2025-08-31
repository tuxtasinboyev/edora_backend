import { PartialType } from '@nestjs/swagger';
import { CreateCourseCategoryDto } from './create-course_category.dto';

export class UpdateCourseCategoryDto extends PartialType(CreateCourseCategoryDto) {}
