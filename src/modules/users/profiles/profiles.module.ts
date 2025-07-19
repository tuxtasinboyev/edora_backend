import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { VerificationModule } from '../../auth/verification/verification.module';

@Module({
  imports: [PrismaModule, JwtModule, VerificationModule, JwtModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule { }
