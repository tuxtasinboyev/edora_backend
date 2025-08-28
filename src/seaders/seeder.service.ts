import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}
  private logger = new Logger(SeederService.name);

  onModuleInit() {
    this.seedUsers();
  }

  async seedUsers() {
    const users = [
      {
        fullName: 'OMADBEK',
        phone: '+998908330183',
        password: 'OMADBEK007',
        role: UserRole.ADMIN,
      },
      {
        fullName: 'OMADBEK',
        phone: '+998906747005',
        password: 'OMADBEK007',
        role: UserRole.STUDENT,
      },
      {
        fullName: 'OMADBEK',
        phone: '+998908461466',
        password: 'OMADBEK007',
        role: UserRole.ASSISTANT,
      },
      {
        fullName: 'OMADBEK',
        phone: '+99890530732',
        password: 'OMADBEK007',
        role: UserRole.MENTOR,
      },
    ];

    for (const userData of users) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phone: userData.phone },
      });

      if (existingUser) {
        this.logger.log(`${userData.role} already exists (${userData.phone})`);
        continue;
      }

      const hashedPassword = await hash(userData.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          phone: userData.phone,
          password: hashedPassword,
          role: userData.role,
          fullName: userData.fullName,
        },
      });

      const isAdmin = userData.role === UserRole.ADMIN;

      await this.prisma.permission.create({
        data: {
          name: userData.fullName,
          can_read: isAdmin,
          can_write: isAdmin,
          can_update: isAdmin,
          can_delete: isAdmin,
          userId: newUser.id,
        },
      });

      this.logger.log(`${userData.role} created (${userData.phone})`);
    }
  }
}

