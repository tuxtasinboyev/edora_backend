import { Injectable } from '@nestjs/common';
import { CreateQuestionsAnswerDto } from './dto/create-questions-answer.dto';
import { UpdateQuestionsAnswerDto } from './dto/update-questions-answer.dto';

@Injectable()
export class QuestionsAnswersService {
  create(createQuestionsAnswerDto: CreateQuestionsAnswerDto) {
    return 'This action adds a new questionsAnswer';
  }

  findAll() {
    return `This action returns all questionsAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionsAnswer`;
  }

  update(id: number, updateQuestionsAnswerDto: UpdateQuestionsAnswerDto) {
    return `This action updates a #${id} questionsAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionsAnswer`;
  }
}
