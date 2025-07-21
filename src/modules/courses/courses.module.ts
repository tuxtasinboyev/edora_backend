import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseCategoryModule } from './course_category/course_category.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { RatingModule } from './rating/rating.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [CourseCategoryModule, PrismaModule, JwtModule, RatingModule],
})
export class CoursesModule {}
