import { PartialType } from '@nestjs/swagger';
import { CreateExamResultDto } from './create-exam-result.dto';

export class UpdateExamResultDto extends PartialType(CreateExamResultDto) {}
