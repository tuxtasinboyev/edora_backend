import { Module } from '@nestjs/common';
import { HomeworkSubmissionService } from './homework-submission.service';
import { HomeworkSubmissionController } from './homework-submission.controller';

@Module({
  controllers: [HomeworkSubmissionController],
  providers: [HomeworkSubmissionService],
})
export class HomeworkSubmissionModule {}
