import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AnswerDto,
  CreateExamDto,
  CreateManyExamDto,
  PassExamDto,
} from './dto/create-exam.dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) { }
  async getExamLessonGroupByLessonGroupId(
    lessonGroupId: number,
    userId: number,
  ) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existsUser) {
      throw new NotFoundException('User not found');
    }
    const lessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id: lessonGroupId },
    });

    if (!lessonGroup) {
      throw new NotFoundException('Lesson group not found');
    }

    const result = await this.prisma.exam.findMany({
      where: {
        group: {
          course: {
            assigned: {
              some: { userId: userId },
            },
          },
        },
        lessonGroupId: lessonGroupId,
      },
      select: {
        id: true,
        question: true,
        variantA: true,
        variantB: true,
        variantC: true,
        variantD: true,
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
    if (result.length === 0) throw new NotFoundException('exam not found!');

    return {
      success: true,
      data: result,
    };
  }
  async pass(payload: PassExamDto, userId: number) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existsUser) throw new NotFoundException('User not found!');

    const existsLessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id: payload.lessonGroupId },
    });
    if (!existsLessonGroup)
      throw new NotFoundException('Lesson group not found!');

    const totalQuestions = await this.prisma.exam.count({
      where: { lessonGroupId: payload.lessonGroupId },
    });

    if (totalQuestions === 0) {
      throw new BadRequestException('No exams found for this lesson group');
    }

    let corrects = 0;
    let wrongs = 0;

    for (const answer of payload.answers) {
      const exam = await this.prisma.exam.findUnique({
        where: { id: answer.id },
      });

      if (!exam) {
        throw new NotFoundException(`Exam with id ${answer.id} not found`);
      }

      if (exam.answer === answer.answer) {
        corrects++;
      } else {
        wrongs++;
      }
    }

    const result = await this.prisma.examResult.create({
      data: {
        corrects,
        wrongs,
        passed: (corrects / totalQuestions) * 100 >= 60 ? true : false,
        userId,
        lessonGroupId: payload.lessonGroupId,
      },
    });

    return {
      success: true,
      data: result,
    };
  }
  async getAllExamDetails(lessonGroupId: number) {
    const existsLessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id: lessonGroupId },
    });
    if (!existsLessonGroup)
      throw new NotFoundException('Lesson group not found!');

    const result = await this.prisma.exam.findMany({
      where: { lessonGroupId },
      select: {
        id: true,
        question: true,
        variantA: true,
        variantB: true,
        variantC: true,
        variantD: true,
        answer: true,
        group: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                about: true,
                level: true,
                assigned: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        fullName: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
            examResults: {
              select: {
                id: true,
                corrects: true,
                wrongs: true,
                passed: true,
              },
            },
          },
        },
      },
    });
    if (result.length === 0)
      throw new NotFoundException('information not found!');
    return {
      success: true,
      data: result,
    };
  }
  async getdetailById(id: number) {
    const result = await this.prisma.exam.findUnique({
      where: { id },
      select: {
        id: true,
        question: true,
        variantA: true,
        variantB: true,
        variantC: true,
        variantD: true,
        answer: true,
        group: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                about: true,
                level: true,
                assigned: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        fullName: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
            examResults: {
              select: {
                id: true,
                corrects: true,
                wrongs: true,
                passed: true,
              },
            },
          },
        },
      },
    });
    if (!result) throw new NotFoundException('exam not found!');

    return {
      success: true,
      data: result,
    };
  }
  async createExam(payload: CreateExamDto) {
    const existsLessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id: payload.lessonGroupId },
    });
    if (!existsLessonGroup)
      throw new NotFoundException('Lesson group not found!');

    const result = await this.prisma.exam.create({
      data: {
        answer: payload.answer,
        question: payload.question,
        variantA: payload.variantA,
        variantB: payload.variantB,
        variantC: payload.variantC,
        variantD: payload.variantD,
        lessonGroupId: payload.lessonGroupId,
      },
    });
    return {
      success: true,
      data: result,
    };
  }
  async createManyExam(payload: CreateManyExamDto) {
    const existsLessonGroup = await this.prisma.lessonGroup.findUnique({
      where: { id: payload.lessonGroupId },
    });
    if (!existsLessonGroup)
      throw new NotFoundException('Lesson group not found!');

    const result = await this.prisma.$transaction(
      payload.exams.map((exam) =>
        this.prisma.exam.create({
          data: {
            question: exam.question,
            variantA: exam.variantA,
            variantB: exam.variantB,
            variantC: exam.variantC,
            variantD: exam.variantD,
            answer: exam.answer,
            lessonGroupId: payload.lessonGroupId,
          },
        }),
      ),
    );
    return {
      success: true,
      data: result,
    };
  }
  async updateExam(id: number, payload: UpdateExamDto) {
    const existsExam = await this.prisma.exam.findUnique({
      where: { id },
    });
    if (!existsExam) throw new NotFoundException('exam  not found!');

    const result = await this.prisma.exam.update({
      where: { id },
      data: payload,
    });
    return {
      success: true,
      data: result,
    };
  }
  async deleteExamById(id: number) {
    const existsExam = await this.prisma.exam.findUnique({
      where: { id },
    });
    if (!existsExam) throw new NotFoundException('exam  not found!');

    await this.prisma.exam.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'successfully deleted!',
    };
  }async getResults(
  user_id: number,
  offset: number = 0,
  limit: number = 8,
  lesson_group_id?: number,
  passed?: boolean
) {
  const where: any = {
    userId: user_id,
  };

  if (typeof lesson_group_id === 'number' && !isNaN(lesson_group_id)) {
    where.lessonGroupId = lesson_group_id;
  }

  if (typeof passed === 'boolean') {
    where.passed = passed;
  }

  const results = await this.prisma.examResult.findMany({
    where,
    skip: !isNaN(offset) ? offset : 0,
    take: !isNaN(limit) ? limit : 8,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          image: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    success: true,
    count: results.length,
    data: results,
  };
}


  async getResultsByLessonGroup(lessonGroupId: number, query: any) {
    const { offset, limit, user_id, passed } = query;

    const where: any = { lessonGroupId };

    if (user_id && !isNaN(+user_id)) {
      where.userId = +user_id;
    }

    if (passed !== undefined) {
      if (passed === 'true') where.passed = true;
      else if (passed === 'false') where.passed = false;
    }

    const take = limit && !isNaN(+limit) ? +limit : 10;
    const skip = offset && !isNaN(+offset) ? +offset : 0;

    const results = await this.prisma.examResult.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      count: results.length,
      data: results,
    };
  }
}
