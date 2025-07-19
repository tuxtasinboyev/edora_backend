import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { MentorsModule } from './users/mentors/mentors.module';
import { LessonsModule } from './lessons/lessons.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { RedisModule } from 'src/config/redis/redis.module';
import { ProfilesModule } from './users/profiles/profiles.module';
import { VerificationModule } from './auth/verification/verification.module';
import { CourseCategoryModule } from './courses/course_category/course_category.module';
import { HomeworkSubmissionModule } from './homework/homework-submission/homework-submission.module';
import { PaymentsModule } from './payments/payments.module';
import { HomeworkModule } from './homework/homework.module';
import { MentorsController } from './users/mentors/mentors.controller';

@Module({
    imports: [PrismaModule, ConfigModule, AuthModule, UsersModule, CoursesModule, MentorsModule, LessonsModule, ExamsModule, QuestionsModule, RedisModule, ProfilesModule, VerificationModule, CourseCategoryModule, HomeworkSubmissionModule, PaymentsModule, HomeworkModule],
    controllers: [MentorsController]
})
export class ModulesModule { }
