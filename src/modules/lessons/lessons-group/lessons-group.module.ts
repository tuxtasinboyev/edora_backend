import { Module } from '@nestjs/common';
import { LessonsGroupService } from './lessons-group.service';
import { LessonsGroupController } from './lessons-group.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [LessonsGroupController],
  providers: [LessonsGroupService],
})
export class LessonsGroupModule { }
