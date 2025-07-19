import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { LessonsFilesService } from './lessons-files.service';
import { CreateLessonsFileDto } from './dto/create-lessons-file.dto';
import { UpdateLessonsFileDto } from './dto/update-lessons-file.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'src/common/utils/helper/helper';

@Controller('lessons-files')
export class LessonsFilesController {
  constructor(private readonly lessonsFilesService: LessonsFilesService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @UseInterceptors(FileInterceptor('file', fileStorage))
  @Post('create')
  async create(@Body() createLessonsFileDto: CreateLessonsFileDto, @UploadedFile() file: Express.Multer.File) {
    return this.lessonsFilesService.createLessonFile(createLessonsFileDto, file.filename)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Get('lesson/:lessonId')
  findAll(@Param('lessonId') lessonId: string) {
    return this.lessonsFilesService.findAll(lessonId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsFilesService.remove(+id);
  }
}
