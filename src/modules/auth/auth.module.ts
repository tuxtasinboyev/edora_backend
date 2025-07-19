import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { VerificationModule } from 'src/modules/auth/verification/verification.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ".env",
  }), JwtModule.register({ global: true }), VerificationModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
