import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePurchasedCourseDto, PurchaseCourseDto } from './dto/create-purchased.dto';
import { UpdatePurchasedDto } from './dto/update-purchased.dto';
import { CourseLevel, PaidVia } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchasedService {
  constructor(private prisma: PrismaService) { }
  async purchaseCourse(userId: number, courseId: string) {
    if (!userId || !courseId) {
      throw new BadRequestException('User ID or Course ID is missing');
    }

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const alreadyPurchased = await this.prisma.purchasedCourse.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (alreadyPurchased) {
      throw new BadRequestException('You have already purchased this course');
    }

    const newPurchase = await this.prisma.purchasedCourse.create({
      data: {
        userId,
        courseId,
        paidVia: PaidVia.CLICK || PaidVia.PAYME
      },
    });

    return {
      success: true,
      message: 'Course purchased successfully',
      data: newPurchase,
    };
  }

  async purchasedCoursedMine(
    userId: number,
    offset: number = 0,
    limit: number = 8,
    search?: string,
    category_id?: number,
    level?: CourseLevel,
  ) {
    try {
      const where: any = {};

      if (userId && !isNaN(+userId)) {
        where.students = {
          some: {
            id: +userId,
          },
        };
      } else {
        throw new BadRequestException('User ID is required');
      }

      if (category_id && !isNaN(+category_id)) {
        where.categoryId = +category_id;
      }

      if (search) {
        where.title = {
          contains: search,
          mode: 'insensitive',
        };
      }

      const validLevels = [
        'BEGINNER',
        'PRE_INTERMEDIATE',
        'INTERMEDIATE',
        'UPPER_INTERMEDIATE',
        'ADVANCED',
      ];
      if (level && validLevels.includes(level)) {
        where.level = level;
      }

      const courses = await this.prisma.course.findMany({
        where,
        skip: !isNaN(+offset) ? +offset : 0,
        take: !isNaN(+limit) ? +limit : 8,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          mentor: {
            select: {
              id: true,
              fullName: true,
              image: true,
            },
          },
        },
      });

      return {
        success: true,
        count: courses.length,
        data: courses,
      };
    } catch (err) {
      console.error('purchasedCoursedMine Error =>', err.message);
      throw new InternalServerErrorException('Kurslarni olishda xatolik yuz berdi');
    }
  }


  async getPurchasedCourseById(userId: number, courseId: string) {
    if (!userId || !courseId) {
      throw new BadRequestException('User ID or Course ID is missing');
    }

    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        assigned: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        category: true,
        mentor: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found or not purchased by user');
    }

    return {
      success: true,
      data: course,
    };
  }



  async getStudentsByCourseId(courseId: string, offset = 0, limit = 8, search?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) throw new NotFoundException('Course not found');

    const where: any = {
      courseId,
    };

    if (search) {
      where.user = {
        fullName: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const students = await this.prisma.purchasedCourse.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { purchasedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      count: students.length,
      data: students.map((sc) => sc.user),
    };
  }

  async createPurchasedCourseCash(dto: CreatePurchasedCourseDto) {
    const { courseId, phone } = dto;

    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (!user) throw new NotFoundException('User not found');

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    const existing = await this.prisma.purchasedCourse.findFirst({
      where: { userId: user.id, courseId },
    });
    if (existing) throw new ConflictException('Course already purchased by this user');

    const purchasedCourse = await this.prisma.purchasedCourse.create({
      data: {
        userId: user.id,
        courseId,
        paidVia: 'CASH',
        purchasedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Purchased course created (paid via CASH)',
      data: purchasedCourse,
    };
  }
}
