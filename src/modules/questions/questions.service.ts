import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-questions.dto';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class QuestionsService {
    constructor(private prisma: PrismaService) { }

    async getMineQuestions(
        userId: number,
        offset: number = 0,
        limit: number = 8,
        read?: boolean,
        answered?: boolean,
        courseId?: string) {

        const existCourseId = await this.prisma.course.findUnique({ where: { id: courseId } })
        if (!existCourseId) throw new NotFoundException('course not found!')

        const where: any = {
            userId
        }

        if (read !== undefined) {
            where.read = read === true
        }
        if (answered !== undefined) {
            const isAnswered = answered === true
            where.AND = [...(where.AND || []), isAnswered ? { answer: { not: null } } : { answer: null }]
        }

        if (courseId) {
            where.courseId = courseId
        }
        const questions = await this.prisma.question.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { answer: true, course: { select: { id: true, name: true } } }
        })
        return {
            success: true,
            count: questions.length,
            data: questions
        }

    }
    async getQuestionsByAll() {
        return this.prisma.question.findMany({
            include: {
                user: { select: { id: true, fullName: true, image: true } },
                course: { select: { id: true, name: true } },
                answer: {
                    select: {
                        id: true,
                        text: true,
                        file: true,
                        user: { select: { id: true, fullName: true, image: true } }
                    }
                }
            }
        });
    }
    async getAnswerAll() {
        return this.prisma.questionAnswer.findMany({ include: { user: { select: { id: true, fullName: true, image: true } }, question: { select: { id: true, text: true, file: true } } } })
    }
    async getQuestionsByCourseId(
        courseId: string,
        offset: number = 0,
        limit: number = 8,
        read?: boolean,
        answered?: boolean,
    ) {
        const existCourseId = await this.prisma.course.findUnique({ where: { id: courseId } })
        if (!existCourseId) throw new NotFoundException('course not found!')

        const where: any = {
            courseId
        }
        if (read !== undefined) {
            where.read = read === true
        }
        if (answered !== undefined) {
            const isAnswered = answered === true
            where.AND = [...(where.AND || []), isAnswered ? { answer: { not: null } } : { answer: null }]
        }

        const question = await this.prisma.question.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                answer: true, course: { select: { id: true, name: true } }, user: {
                    select: {
                        id: true, fullName: true, image: true

                    }
                }
            }
        })
        return {
            success: true,
            data: question
        }
    }
    async getOneById(id: number) {
        const existsQuestion = await this.prisma.question.findUnique({
            where: { id },
            select: {
                id: true, text: true, file: true, read: true, readAt: true, user: { select: { id: true, fullName: true, image: true } }, course: { select: { id: true, name: true, banner: true } }, answer: {
                    select: { id: true, file: true, text: true }

                }
            }
        })
        if (!existsQuestion) throw new NotFoundException('question not found!')
        return {
            success: true,
            data: existsQuestion
        }
    }
    async readById(id: number) {
        const existsQuestion = await this.prisma.question.findUnique({ where: { id } })
        if (!existsQuestion) throw new NotFoundException('question not found!')

        const result = await this.prisma.question.update({
            where: { id },
            data: {
                read: true,
                readAt: new Date()
            }
        })
        return {
            success: true,
            data: result
        }
    }
    async createQuestions(userId: number, payload: CreateQuestionDto, courseId: string, file?: string) {
        const existCourseId = await this.prisma.course.findUnique({ where: { id: courseId } })
        if (!existCourseId) throw new NotFoundException('course not found!')

        const ExistsUser = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!ExistsUser) throw new NotFoundException('user not found!')
        const result = await this.prisma.question.create({
            data: {
                text: payload.text,
                file: file,
                courseId: courseId,
                userId
            }
        })
        return {
            success: true,
            data: result
        }
    }
    async updateQuestions(userId: number, payload: CreateQuestionDto, id: number, file?: string) {
        const existsQuestion = await this.prisma.question.findUnique({ where: { id } })
        if (!existsQuestion) throw new NotFoundException('questions not found!')

        const ExistsUser = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!ExistsUser) throw new NotFoundException('user not found!')
        if (existsQuestion.userId !== userId) {
            throw new ForbiddenException("You are not allowed to update this question");
        }

        if (existsQuestion.file) {
            const oldPath = join(process.cwd(), 'uploads', 'questionFile', existsQuestion.file.split('/').pop()!)
            if (existsSync(oldPath)) {
                unlinkSync(oldPath)
            }
        }
        const result = await this.prisma.question.update({
            where: { id },
            data: {
                text: payload.text,
                file: file,
                userId
            }
        })
        return {
            success: true,
            data: result
        }
    }
    async createAnswer(id: number, userId: number, payload: CreateQuestionDto, file?: string) {
        const existsQuestion = await this.prisma.question.findUnique({ where: { id } })
        if (!existsQuestion) throw new NotFoundException('question not found')

        const existsUser = await this.prisma.user.findUnique({ where: { id } })
        if (!existsUser) throw new NotFoundException('user not found!')
        const result = await this.prisma.questionAnswer.create({
            data: {
                text: payload.text,
                file: file,
                userId,
                questionId: id
            }
        })
        return {
            success: true,
            data: result
        }
    }
    async deleteQuestionAnswer(questionId: number) {
        const existsAnswer = await this.prisma.questionAnswer.findUnique({
            where: {
                questionId,
            },
        });

        if (!existsAnswer) {
            throw new NotFoundException('Answer not found or you are not allowed');
        }

        await this.prisma.questionAnswer.delete({
            where: {
                id: existsAnswer.id,
            },
        });

        return {
            success: true,
            message: 'Successfully deleted!',
        };
    }

    async deleteQuestion(userId: number) {
        const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!existsUser) throw new NotFoundException('userId not found!')

        await this.prisma.questionAnswer.deleteMany({ where: { userId: userId } })

        return {
            success: true,
            message: "successfully deleted!"
        }
    }
}  
