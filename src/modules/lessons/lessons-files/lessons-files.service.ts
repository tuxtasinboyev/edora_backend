import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonsFileDto } from './dto/create-lessons-file.dto';
import { UpdateLessonsFileDto } from './dto/update-lessons-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonsFilesService {
  constructor(private prisma: PrismaService) { }
  async createLessonFile(payload: CreateLessonsFileDto, file: string) {
    if (!file) {
      throw new BadRequestException('File is required!');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: payload.lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const savedFile = await this.prisma.lessonFile.create({
      data: {
        file: file,
        note: payload.note,
        lessonId: payload.lessonId,
      },
    });

    return {
      success: true,
      data: savedFile,
    };
  }

  async findAll(lessonId: string) {
    const existsLesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!existsLesson) throw new NotFoundException('lesson not found!');

    const result = await this.prisma.lessonFile.findMany({
      where: { lessonId },
      include: {
        lesson: {
          select: {
            id: true,
            name: true,
            about: true,
            video: true,
          },
        },
      },
    });
    return {
      success: true,
      data: result,
    };
  }

  async remove(id: number) {
    const existsLessonFile = await this.prisma.lessonFile.findUnique({
      where: { id },
    });
    if (!existsLessonFile)
      throw new NotFoundException('Lesson file not found!');

    await this.prisma.lessonFile.delete({ where: { id } });

    return {
      success: true,
      message: 'successfully deleted!',
    };
  }
}
