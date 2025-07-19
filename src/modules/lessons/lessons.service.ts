import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto/update-lesson.dto';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }
    async getOneById(id: string, userId: number) {
        const existsLesson = await this.prisma.lesson.findUnique({ where: { id, lessonViews: { some: { userId: userId } } }, include: { group: { select: { id: true, name: true } } } })
        if (!existsLesson) throw new NotFoundException("lesson not found!")

        const existingUser = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!existingUser) throw new NotFoundException('user not found!')
        await this.prisma.lessonView.upsert({
            where: {
                lessonId_userId: {
                    lessonId: existsLesson.id,
                    userId: userId,
                },
            },
            update: {
                view: true,
            },
            create: {
                lessonId: existsLesson.id,
                userId: userId,
                view: true,
            },
        });


        return {
            success: true,
            data: existsLesson

        }
    }
    async getOneLessonViews(id: string, userId: number) {
        const existsLessonView = await this.prisma.lessonView.findMany({ where: { AND: [{ lessonId: id }, { userId: userId }] }, include: { user: { select: { id: true, fullName: true, image: true } } } })
        if (!existsLessonView) throw new NotFoundException("lesson not found!")

        return {
            success: true,
            data: existsLessonView
        }

    }
    async getAllDetails(id: string) {
        const result = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                Course:
                {
                    select: {
                        id: true,
                        name: true,
                        about: true,
                        banner: true,
                        introVideo: true,
                        level: true,
                        mentor: {
                            select: {
                                id: true,
                                fullName: true,
                                image: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        ratings: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true,
                        examResults: true,
                        exams: {
                            select:
                            {
                                id: true,
                                answer: true
                            }
                        }
                    }
                },
                homework: {
                    select:
                    {
                        id: true,
                        task: true,
                        file: true,
                        submissions:
                        {
                            select:
                            {
                                id: true,
                                text: true,
                                status: true,
                                user: {
                                    select:
                                    {
                                        id: true,
                                        fullName: true,
                                        image: true
                                    }
                                },
                            }
                        }
                    }
                },
                LastActivity: {
                    select: {
                        id: true,
                        url: true,
                        userId: true,
                        lesson: {
                            select:
                            {
                                id: true,
                                about: true,
                                name: true,
                                video: true
                            }
                        }
                    }
                },
                lessonFiles: {
                    select:
                    {
                        id: true,
                        file: true,
                        note: true,
                        createdAt: true
                    }
                },
                lessonViews: {
                    select: {
                        id: true,
                        view: true,
                        userId: true
                    }
                },
                _count: true
            }
        })
        if (!result) throw new NotFoundException('information not found!')

        return {
            success: true,
            data: result
        }
    }
    async delteLesson(id: string) {
        const existsLessonView = await this.prisma.lesson.findUnique({ where: { id } })
        if (!existsLessonView) throw new NotFoundException("lesson not found!")
        await this.prisma.lesson.delete({ where: { id } })

        return {
            success: true,
            message: "successfully deleted"
        }

    }
    async createLesson(payload: CreateLessonDto, video: string) {
        if (payload.courseId) {
            const existsCourse = await this.prisma.course.findUnique({ where: { id: payload.courseId } })
            if (!existsCourse) throw new NotFoundException('course not found!')
        }
        if (payload.groupId) {
            const existsGroup = await this.prisma.lessonGroup.findUnique({ where: { id: payload.groupId } })
            if (!existsGroup) throw new NotFoundException('group not found')
        }

        const result = await this.prisma.lesson.create({
            data: {
                about: payload.about,
                name: payload.name,
                video: video,
                courseId: payload.courseId,
                groupId: payload.groupId
            }
        })
        return {
            success: true,
            data: result
        }
    }
    async updateLessons(payload: UpdateLessonDto, video: string, id: string) {
        const existingLesson = await this.prisma.lesson.findUnique({ where: { id } });
        if (!existingLesson) throw new NotFoundException('Lesson not found');

        if (payload.courseId) {
            const existsCourse = await this.prisma.course.findUnique({ where: { id: payload.courseId } });
            if (!existsCourse) throw new NotFoundException('Course not found!');
        }

        if (payload.groupId) {
            const existsGroup = await this.prisma.lessonGroup.findUnique({ where: { id: payload.groupId } });
            if (!existsGroup) throw new NotFoundException('Group not found');
        }

        if (existingLesson.video && existingLesson.video !== video) {
            const oldVideoPath = path.join(process.cwd(), "src", "common", "utils", "uploads", "videos", existingLesson.video);
            if (fs.existsSync(oldVideoPath)) {
                fs.unlinkSync(oldVideoPath);
            }
        }

        const result = await this.prisma.lesson.update({
            where: { id },
            data: {
                ...payload,
                video,
            },
        });

        return {
            success: true,
            data: result,
        };
    }



}
