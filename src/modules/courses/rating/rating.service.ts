import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}
  async create(createRatingDto: CreateRatingDto, userId: number) {
    const existsCourse = await this.prisma.course.findUnique({
      where: { id: createRatingDto.courseId },
    });
    if (!existsCourse) throw new NotFoundException('course not found!');

    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existsUser) throw new NotFoundException('user not found!');

    const createResult = await this.prisma.rating.create({
      data: {
        comment: createRatingDto.comment,
        rate: createRatingDto.rating,
        courseId: createRatingDto.courseId,
        userId: userId,
      },
    });

    return {
      success: true,
      data: createResult,
    };
  }

  async findAll() {
    const result = await this.prisma.rating.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!result) throw new NotFoundException('rating not found!');

    return {
      success: true,
      data: result,
    };
  }

  async getRatingListBy(courseId: string, offset: number=0, limit: number=8) {
    const existsCourse = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!existsCourse) throw new NotFoundException('course not found!');

    const result = await this.prisma.rating.findMany({
      where: { courseId },
      skip: offset,
      take: limit,
    });
    if (!result) throw new NotFoundException('rating not found!');

    return {
      success: true,
      data: result,
    };
  }

  async getCourseById(id: string) {
    const existsCourse = await this.prisma.course.findUnique({
      where: { id: id },
    });
    if (!existsCourse) throw new NotFoundException('course not found!');

    const result = await this.prisma.rating.findMany({
      where: { courseId: id },
    });
    if (!result) throw new NotFoundException('rating not found!');

    return {
      success: true,
      data: result,
    };
  }

  async remove(id: number) {
    const existsRating = await this.prisma.rating.findUnique({ where: { id } });
    if (!existsRating) throw new NotFoundException('rating not found!');

    await this.prisma.rating.delete({ where: { id } });
    return {
      success: true,
      message: 'successfuly deleted!',
    };
  }
}
