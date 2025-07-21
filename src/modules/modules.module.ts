import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/config/redis/redis.module';

import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './auth/verification/verification.module';

import { UsersModule } from './users/users.module';
import { ProfilesModule } from './users/profiles/profiles.module';

import { CoursesModule } from './courses/courses.module';
import { CourseCategoryModule } from './courses/course_category/course_category.module';

import { LessonsModule } from './lessons/lessons.module';

import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';

import { PaymentsModule } from './payments/payments.module';
import { HomeworkModule } from './homework/homework.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    VerificationModule,
    UsersModule,
    ProfilesModule,
    CoursesModule,
    CourseCategoryModule,
    LessonsModule,
    ExamsModule,
    QuestionsModule,
    PaymentsModule,
    HomeworkModule,
  ],
  controllers: [],
  providers: [],
})
export class ModulesModule { }
