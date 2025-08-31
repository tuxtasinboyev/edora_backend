import { Module } from '@nestjs/common';
import { SeederService } from './seaders/seeder.service';
import { ModulesModule } from './modules/modules.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './telegram/telegram.module';

@Module({
  imports: [ModulesModule, PrismaModule, ContactModule],
  providers: [SeederService],
})
export class AppModule { }
