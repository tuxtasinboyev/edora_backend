import { PartialType } from '@nestjs/swagger';
import { CreateQuestionsAnswerDto } from './create-questions-answer.dto';

export class UpdateQuestionsAnswerDto extends PartialType(CreateQuestionsAnswerDto) {}
