import { Module } from '@nestjs/common';
import { PurchasedService } from './purchased.service';
import { PurchasedController } from './purchased.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[PrismaModule,JwtModule],
  controllers: [PurchasedController],
  providers: [PurchasedService],
})
export class PurchasedModule {}
