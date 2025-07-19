import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HomeworkSubmissionService } from './homework-submission.service';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto';

@Controller('homework-submission')
export class HomeworkSubmissionController {
  constructor(private readonly homeworkSubmissionService: HomeworkSubmissionService) {}

  @Post()
  create(@Body() createHomeworkSubmissionDto: CreateHomeworkSubmissionDto) {
    return this.homeworkSubmissionService.create(createHomeworkSubmissionDto);
  }

  @Get()
  findAll() {
    return this.homeworkSubmissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkSubmissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto) {
    return this.homeworkSubmissionService.update(+id, updateHomeworkSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkSubmissionService.remove(+id);
  }
}
