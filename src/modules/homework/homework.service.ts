import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) { }
  async getHomeworkByCourseId(courseId: string, offset: number = 0, limit: number = 10) {

    const existCourseId = await this.prisma.lesson.findMany({ where: { courseId: courseId }, select: { id: true } })
    if (!existCourseId) throw new NotFoundException("leson not found!")

    const lessonIds = existCourseId.map(ids => ids.id)
    if (lessonIds.length === 0) {
      return {
        success: true,
        data: []
      }
    }
    const result = await this.prisma.homework.findMany({
      where: { lessonId: { in: lessonIds } },
      skip: offset, take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        task: true,
        file: true,
        lesson: {
          select: {
            id: true,
            name: true,
            about: true
          }
        }
      }
    })
    return {
      success: true,
      count: result.length,
      data: result
    }

  }

  async getHommeworkAllDetails(lessonId: string) {
    const existsLessonId = await this.prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!existsLessonId) throw new NotFoundException('lesson not found!')

    const result = await this.prisma.homework.findUnique({
      where: { lessonId },
      select:
      {
        id: true, task: true,
        file: true,
        lesson: { select: { id: true, name: true, about: true, video: true, group: { select: { id: true, name: true } } } },
        submissions: { select: { id: true, text: true, status: true, reason: true, file: true, user: { select: { id: true, fullName: true, image: true } } } }
      }
    })
    return {
      success: true,
      data: result
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} homework`;
  }

  update(id: number, updateHomeworkDto: UpdateHomeworkDto) {
    return `This action updates a #${id} homework`;
  }

  remove(id: number) {
    return `This action removes a #${id} homework`;
  }
}
