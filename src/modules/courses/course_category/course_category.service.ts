import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course_category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseCategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const existCategory = await this.prisma.courseCategory.findUnique({
      where: { name: createCourseCategoryDto.name },
    });
    if (existCategory)
      throw new ConflictException('this catory already exists!');

    const result = await this.prisma.courseCategory.create({
      data: {
        name: createCourseCategoryDto.name,
      },
    });
    return {
      succes: true,
      data: result,
    };
  }

  async findAll() {
    return await this.prisma.courseCategory.findMany();
  }

  async findOne(name: string) {
    const existCategory = await this.prisma.courseCategory.findUnique({
      where: { name: name },
    });
    if (!existCategory) throw new ConflictException('catgory not found!');

    return {
      success: true,
      data: existCategory,
    };
  }

  async update(id: number, updateCourseCategoryDto: UpdateCourseCategoryDto) {
    const existCategory = await this.prisma.courseCategory.findUnique({
      where: { id: id },
    });
    if (!existCategory) throw new ConflictException('catgory not found!');

    const checkName = await this.prisma.courseCategory.findUnique({
      where: { name: updateCourseCategoryDto.name },
    });
    if (checkName) throw new ConflictException('this catory already exists!');

    const result = await this.prisma.courseCategory.update({
      where: { id },
      data: updateCourseCategoryDto,
    });
    return {
      success: true,
      data: result,
    };
  }

  async remove(id: number) {
    const existCategory = await this.prisma.courseCategory.findUnique({
      where: { id: id },
    });
    if (!existCategory) throw new ConflictException('catgory not found!');

    await this.prisma.courseCategory.delete({ where: { id } });
    return {
      success: true,
      message: 'successfully deleted',
    };
  }
}
