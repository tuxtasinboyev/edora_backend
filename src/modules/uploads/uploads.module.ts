import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UploadsService],
  exports: [UploadsService]
})
export class UploadsModule { }
