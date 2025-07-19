import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { ExamResultModule } from './exam-result/exam-result.module';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService],
  imports: [ExamResultModule]
})
export class ExamsModule {}
