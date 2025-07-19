import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonsGroupDto } from './dto/create-lessons-group.dto';
import { UpdateLessonsGroupDto } from './dto/update-lessons-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonsGroupService {
  constructor(private prisma: PrismaService) { }
  async create(createLessonsGroupDto: CreateLessonsGroupDto) {
    const { name, courseId } = createLessonsGroupDto;
    const existsCourse = await this.prisma.course.findUnique({ where: { id: courseId } })
    if (!existsCourse) throw new NotFoundException('course not found!')
    const newGroup = await this.prisma.lessonGroup.create({
      data: {
        name,
        courseId,
      },
    });
    return {
      success: true,
      data: newGroup,
    };
  }

  async getLessonsGroupAllByCourseId(
    courseId: string,
    offset?: number,
    limit?: number,
    include_lessons?: boolean,
  ) {
    const existsCourse = await this.prisma.course.findUnique({ where: { id: courseId } })
    if (!existsCourse) throw new NotFoundException('course not found!')
    const where = { courseId };

    const findOptions: any = {
      where,
      orderBy: { createdAt: 'desc' },
    };

    if (typeof offset === 'number') {
      findOptions.skip = offset;
    }

    if (typeof limit === 'number') {
      findOptions.take = limit;
    }

    if (include_lessons === true) {
      findOptions.include = {
        lessons: true,
      };
    }

    const groups = await this.prisma.lessonGroup.findMany(findOptions);

    return {
      success: true,
      count: groups.length,
      data: groups,
    };
  }


  async getMineOneByCourseID(
    userId: number,
    courseId: string,
    offset: number,
    limit: number,
    include_lessons: boolean,
  ) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new NotFoundException('user not found')

    const existsCourse = await this.prisma.course.findUnique({ where: { id: courseId } })
    if (!existsCourse) throw new NotFoundException('course not found!')

    const result = await this.prisma.lessonGroup.findMany({
      where: {
        courseId,
        course: {
          assigned: {
            some: {
              userId: userId,
            },
          },
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: include_lessons ? { lessons: true } : undefined,
    });

    return {
      success: true,
      count: result.length,
      data: result,
    };
  }
  async getLessonGroupDetails(userId: number, id: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!existingUser) throw new NotFoundException('user not found')

    const existsLessonGroup = await this.prisma.lessonGroup.findMany({ where: { id, course: { assigned: { some: { userId } } } }, include: { lessons: { select: { id: true, name: true, video: true } } } })
    if (!existsLessonGroup) throw new NotFoundException('lessongroup not found!')

    return {
      success: true,
      data: existsLessonGroup
    }

  }

  async update(id: number, updateLessonsGroupDto: UpdateLessonsGroupDto) {
    const existsCourse = await this.prisma.course.findUnique({ where: { id: updateLessonsGroupDto.courseId } })
    if (!existsCourse) throw new NotFoundException('course not found!')

    const existsGroup = await this.prisma.lessonGroup.findUnique({ where: { id } })
    if (!existsGroup) throw new NotFoundException('group not found!')

    const updatedGroup = await this.prisma.lessonGroup.update({
      where: { id },
      data: {
        name: updateLessonsGroupDto.name,
        courseId: updateLessonsGroupDto.courseId,
      },
    });

    return {
      success: true,
      data: updatedGroup,
    };

  }


  async remove(id: number) {
    const existsGroup = await this.prisma.lessonGroup.findUnique({ where: { id } })
    if (!existsGroup) throw new NotFoundException('group not found!')

    await this.prisma.lessonGroup.delete({ where: { id } })

    return {
      success: true,
      message: 'Group deleted successfully',
    };
  }
}
