import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { MentorsController } from './modules/mentors/mentors.controller';
import { QuestionsModule } from './modules/questions/questions.module';
import { ExamsModule } from './modules/exams/exams.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { RedisModule } from './config/redis/redis.module';
import { CourseCategoryModule } from './modules/courses/course_category/course_category.module';
import { VerificationModule } from './modules/verification/verification.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SeederService } from './seaders/seeder.service';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule, UsersModule, CoursesModule, MentorsModule, LessonsModule, UploadsModule, RatingsModule, ExamsModule, QuestionsModule, RedisModule, ProfilesModule, VerificationModule, CourseCategoryModule],
  controllers: [MentorsController],
  providers: [SeederService],
})
export class AppModule { }
