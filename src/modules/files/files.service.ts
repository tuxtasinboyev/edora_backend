import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) { }
  async publicName(name: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { name },
      include: {
        lessonFiles: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found!');
    }

    if (!lesson.lessonFiles.map(file => file.file) || lesson.lessonFiles.map(file => file.file).length === 0) {
      throw new NotFoundException('No files found for this lesson');
    }

    return {
      success: true,
      datas: lesson,
      data: lesson.lessonFiles.map(file => file.file),
    };
  }


  async getFileByNameWithByLessonId(name: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { AND: [{ name }, { id: lessonId }] },
      include: {
        lessonFiles: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found!');
    }
    if (!lesson.lessonFiles.map(file => file.file) || lesson.lessonFiles.map(file => file.file).length === 0) {
      throw new NotFoundException('No files found for this lesson');
    }

    return {
      success: true,
      datas: lesson,
      data: lesson.lessonFiles.map(file => file.file),
    };
  }
}
