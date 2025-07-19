import { PartialType } from '@nestjs/swagger';
import { CreateHomeworkSubmissionDto } from './create-homework-submission.dto';

export class UpdateHomeworkSubmissionDto extends PartialType(CreateHomeworkSubmissionDto) {}
