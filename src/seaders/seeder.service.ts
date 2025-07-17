import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }
    private logger = new Logger(SeederService.name)
    onModuleInit() {
        this.createAdmin()
    }


    async createAdmin() {
        const phone = "+998908330183"
        const password = "OMADBEK007"
        const role = UserRole.ADMIN
        const fullName = "OMADBEK"
        const can_read = true
        const can_write = true
        const can_delete = true
        const can_update = true

        const existingUser = await this.prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            this.logger.log('Admin already exists');
            return;
        }

        const admin = await this.prisma.user.create({
            data: {
                phone,
                password,
                role,
                fullName,
            },
        });
        await this.prisma.permission.create(
            {
                data: {
                    name: admin.fullName,
                    can_delete,
                    can_read,
                    can_update,
                    can_write,
                    userId: admin.id
                }
            }
        )
        this.logger.log("Admin joined the database")

    }
}
