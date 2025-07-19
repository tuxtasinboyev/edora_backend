import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService],
})
export class HomeworkModule {}
