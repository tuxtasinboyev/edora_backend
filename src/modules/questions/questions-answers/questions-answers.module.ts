import { Module } from '@nestjs/common';
import { QuestionsAnswersService } from './questions-answers.service';
import { QuestionsAnswersController } from './questions-answers.controller';

@Module({
  controllers: [QuestionsAnswersController],
  providers: [QuestionsAnswersService],
})
export class QuestionsAnswersModule {}
