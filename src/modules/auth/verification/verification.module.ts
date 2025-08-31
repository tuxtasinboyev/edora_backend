import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { SmsService } from 'src/common/services/sms.service';
import { RedisModule } from 'src/config/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [RedisModule, PrismaModule],
  providers: [VerificationService, SmsService],
  controllers: [VerificationController],
  exports: [VerificationService],
})
export class VerificationModule {}
