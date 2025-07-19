import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionsAnswersModule } from './questions-answers/questions-answers.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [QuestionsAnswersModule]
})
export class QuestionsModule {}
