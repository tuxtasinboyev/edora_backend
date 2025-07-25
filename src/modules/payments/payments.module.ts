import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [PrismaModule, JwtModule,CacheModule.register()],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule { }
