import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CheckAproved,
  CreateHomeworkDto,
  CreateHomeworkSubmissionDto,
} from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class HomeworkService {
  constructor(private prisma: PrismaService) {}
  async getHomeworkByCourseId(
    courseId: string,
    offset: number = 0,
    limit: number = 10,
  ) {
    const existCourseId = await this.prisma.lesson.findMany({
      where: { courseId: courseId },
      select: { id: true },
    });
    if (!existCourseId) throw new NotFoundException('leson not found!');

    const lessonIds = existCourseId.map((ids) => ids.id);
    if (lessonIds.length === 0) {
      return {
        success: true,
        data: [],
      };
    }
    const result = await this.prisma.homework.findMany({
      where: { lessonId: { in: lessonIds } },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        task: true,
        file: true,
        lesson: {
          select: {
            id: true,
            name: true,
            about: true,
          },
        },
      },
    });
    return {
      success: true,
      count: result.length,
      data: result,
    };
  }

  async getHommeworkAllDetails(lessonId: string) {
    const existsLessonId = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!existsLessonId) throw new NotFoundException('lesson not found!');

    const result = await this.prisma.homework.findUnique({
      where: { lessonId },
      select: {
        id: true,
        task: true,
        file: true,
        lesson: {
          select: {
            id: true,
            name: true,
            about: true,
            video: true,
            group: { select: { id: true, name: true } },
          },
        },
        submissions: {
          select: {
            id: true,
            text: true,
            status: true,
            reason: true,
            file: true,
            user: { select: { id: true, fullName: true, image: true } },
          },
        },
      },
    });
    if (!result)
      throw new NotFoundException('belong to homework lesson not found!');
    return {
      success: true,
      data: result,
    };
  }

  async createHommework(payload: CreateHomeworkDto, file?: string) {
    const existsLessonId = await this.prisma.lesson.findUnique({
      where: { id: payload.lessonId },
    });
    if (!existsLessonId) throw new NotFoundException('lesson not found!');

    const result = await this.prisma.homework.create({
      data: {
        task: payload.task,
        file: file,
        lessonId: payload.lessonId,
      },
    });
    return {
      success: true,
      data: result,
    };
  }

  async update(
    id: number,
    updateHomeworkDto: UpdateHomeworkDto,
    file?: string,
  ) {
    const existsLessonId = await this.prisma.lesson.findUnique({
      where: { id: updateHomeworkDto.lessonId },
    });
    if (!existsLessonId) throw new NotFoundException('lesson not found!');

    const existsHomework = await this.prisma.homework.findUnique({
      where: { id },
    });
    if (!existsHomework) throw new NotFoundException('homework not found!');
    if (existsHomework.file) {
      const oldPath = join(
        process.cwd(),
       'uploads', 'homeworkFile', existsHomework.file.split('/').pop()!
      );

      if (existsSync(oldPath)) {
        unlinkSync(oldPath);
      }
    }

    const updateHomework = await this.prisma.homework.update({
      where: { id },
      data: { ...updateHomeworkDto, file: file },
    });

    return {
      success: true,
      data: updateHomework,
    };
  }

  async remove(id: number) {
    const existsHomework = await this.prisma.homework.findUnique({
      where: { id },
    });
    if (!existsHomework) throw new NotFoundException('homework not found!');
    await this.prisma.homework.delete({ where: { id } });

    return {
      success: true,
      message: 'successfully deleted',
    };
  }
  async getMineSubmission(
    lessonId: string,
    userId: number,
    offset: number = 0,
    limit: number = 8,
  ) {
    const existsLessonId = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!existsLessonId) throw new NotFoundException('lesson not found!');

    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existsUser) throw new NotFoundException('user not found!');

    const result = await this.prisma.homeworkSubmission.findMany({
      where: { AND: [{ homework: { lessonId } }, { userId }] },
      skip: offset,
      take: limit,
      select: {
        id: true,
        text: true,
        reason: true,
        status: true,
        file: true,
        user: {
          select: { id: true, fullName: true, image: true },
        },
        homework: {
          select: { id: true, task: true, file: true, createdAt: true },
        },
      },
    });
    return {
      success: true,
      data: result,
    };
  }

  async submitHomework(
    lessonId: string,
    userId: number,
    dto: CreateHomeworkSubmissionDto,
    fileName: string,
  ) {
    const homework = await this.prisma.homework.findUnique({
      where: { lessonId },
    });

    if (!homework) {
      throw new NotFoundException('Homework not found');
    }

    const existing = await this.prisma.homeworkSubmission.findFirst({
      where: { userId, homeworkId: homework.id },
    });

    if (existing) {
      throw new BadRequestException('You already submitted this homework');
    }

    const submission = await this.prisma.homeworkSubmission.create({
      data: {
        homeworkId: homework.id,
        userId,
        file: fileName,
        text: dto.text,
        reason: dto.reason,
      },
    });

    return {
      success: true,
      data: submission,
    };
  }
  async getAllSubmissions(query: any) {
    const { offset, limit, status, course_id, homework_id, user_id } = query;

    const where: any = {};

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status;
    }

    if (homework_id && !isNaN(+homework_id)) {
      where.homeworkId = +homework_id;
    }

    if (user_id && !isNaN(+user_id)) {
      where.userId = +user_id;
    }

    if (course_id && !isNaN(+course_id)) {
      where.homework = {
        lesson: {
          group: {
            courseId: +course_id,
          },
        },
      };
    }

    const skip = offset && !isNaN(+offset) ? +offset : 0;
    const take = limit && !isNaN(+limit) ? +limit : 10;

    const submissions = await this.prisma.homeworkSubmission.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
        homework: {
          select: {
            id: true,
            task: true,
            lesson: {
              select: {
                id: true,
                name: true,
                group: {
                  select: {
                    id: true,
                    name: true,
                    course: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      count: submissions.length,
      data: submissions,
    };
  }

  async getSubmissionsOneById(id: number) {
    const existsHomeworkSubmision =
      await this.prisma.homeworkSubmission.findUnique({
        where: { id },
        select: {
          id: true,
          text: true,
          file: true,
          reason: true,
          status: true,
          homework: { select: { id: true, task: true, file: true } },
          user: { select: { id: true, fullName: true, image: true } },
        },
      });
    if (!existsHomeworkSubmision)
      throw new NotFoundException('homeworkSubmision not found!');
    return {
      success: true,
      data: existsHomeworkSubmision,
    };
  }
  async checkSubmisionHommework(payload: CheckAproved) {
    const existsHomeworkSubmision =
      await this.prisma.homeworkSubmission.findUnique({
        where: { id: payload.submissionId },
      });
    if (!existsHomeworkSubmision)
      throw new NotFoundException('homework submission  not found!');

    const result = await this.prisma.homeworkSubmission.update({
      where: { id: payload.submissionId },
      data: { reason: payload.reason, status: payload.approved },
    });
    return {
      success: true,
      data: result,
    };
  }
}
