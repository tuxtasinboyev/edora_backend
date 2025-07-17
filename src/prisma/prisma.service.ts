import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "@prisma/client"
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
    async onModuleInit() {
        try {
            await this.$connect()
        } catch (error) {
            console.log("database connection erorr");

        }
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }
}
