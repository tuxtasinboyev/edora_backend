import { Module } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CourseCategoryController } from './course_category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
})
export class CourseCategoryModule { }
