import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamResultService } from './exam-result.service';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { UpdateExamResultDto } from './dto/update-exam-result.dto';

@Controller('exam-result')
export class ExamResultController {
  constructor(private readonly examResultService: ExamResultService) {}

  @Post()
  create(@Body() createExamResultDto: CreateExamResultDto) {
    return this.examResultService.create(createExamResultDto);
  }

  @Get()
  findAll() {
    return this.examResultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examResultService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamResultDto: UpdateExamResultDto) {
    return this.examResultService.update(+id, updateExamResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examResultService.remove(+id);
  }
}
