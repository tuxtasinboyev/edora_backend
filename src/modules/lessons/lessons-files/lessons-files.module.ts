import { Module } from '@nestjs/common';
import { LessonsFilesService } from './lessons-files.service';
import { LessonsFilesController } from './lessons-files.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [LessonsFilesController],
  providers: [LessonsFilesService],
})
export class LessonsFilesModule {}
