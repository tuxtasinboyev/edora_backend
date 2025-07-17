import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseCategoryModule } from './course_category/course_category.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [CourseCategoryModule, PrismaModule, JwtModule]
})
export class CoursesModule { }
