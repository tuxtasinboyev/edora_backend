import { Injectable } from '@nestjs/common';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto';

@Injectable()
export class HomeworkSubmissionService {
  create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto) {
    return 'This action adds a new homeworkSubmission';
  }

  findAll() {
    return `This action returns all homeworkSubmission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} homeworkSubmission`;
  }

  update(id: number, updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto) {
    return `This action updates a #${id} homeworkSubmission`;
  }

  remove(id: number) {
    return `This action removes a #${id} homeworkSubmission`;
  }
}
