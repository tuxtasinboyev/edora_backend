import { Module } from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { ExamResultController } from './exam-result.controller';

@Module({
  controllers: [ExamResultController],
  providers: [ExamResultService],
})
export class ExamResultModule {}
