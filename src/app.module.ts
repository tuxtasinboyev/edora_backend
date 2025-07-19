import { Module } from '@nestjs/common';
import { SeederService } from './seaders/seeder.service';
import { ModulesModule } from './modules/modules.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [ModulesModule,PrismaModule],
  providers: [SeederService],
})
export class AppModule { }
