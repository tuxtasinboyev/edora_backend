import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamsService {
    constructor(private prisma: PrismaService) { }
    async getExamLessonGroupByLessonGroupId(lessonGroupId: number, userId: number) {
        const existsUser = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existsUser) {
            throw new NotFoundException('User not found');
        }
        const lessonGroup = await this.prisma.lessonGroup.findUnique({
            where: { id: lessonGroupId }
        });

        if (!lessonGroup) {
            throw new NotFoundException('Lesson group not found');
        }

        const result = await this.prisma.exam.findMany({
            where: {
                group: {
                    course: {
                        assigned: {
                            some: { userId: userId }
                        }
                    }
                },
                lessonGroupId: lessonGroupId
            },
            select: {
                id: true,
                question: true,
                variantA: true,
                variantB: true,
                variantC: true,
                variantD: true,
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                id: 'asc'
            }
        });
        if (result.length === 0) throw new NotFoundException('exam not found!')

        return {
            success: true,
            data: result,
        };
    }
    async 
}
