import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsAnswersService } from './questions-answers.service';
import { CreateQuestionsAnswerDto } from './dto/create-questions-answer.dto';
import { UpdateQuestionsAnswerDto } from './dto/update-questions-answer.dto';

@Controller('questions-answers')
export class QuestionsAnswersController {
  constructor(private readonly questionsAnswersService: QuestionsAnswersService) {}

  @Post()
  create(@Body() createQuestionsAnswerDto: CreateQuestionsAnswerDto) {
    return this.questionsAnswersService.create(createQuestionsAnswerDto);
  }

  @Get()
  findAll() {
    return this.questionsAnswersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsAnswersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionsAnswerDto: UpdateQuestionsAnswerDto) {
    return this.questionsAnswersService.update(+id, updateQuestionsAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsAnswersService.remove(+id);
  }
}
