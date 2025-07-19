import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { LessonsGroupModule } from './lessons-group/lessons-group.module';
import { LessonsFilesModule } from './lessons-files/lessons-files.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  imports: [LessonsGroupModule, LessonsFilesModule, PrismaModule]
})
export class LessonsModule { }
