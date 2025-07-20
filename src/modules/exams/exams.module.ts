import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService],
  imports: [PrismaModule,JwtModule]
})
export class ExamsModule {}
