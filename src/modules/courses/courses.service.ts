import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseLevel, UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAsisant } from '../users/dto/create-asisant.dto/create-asissant.dto';
import { CreateAssisantDto } from './dto/create-asisant';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateCourseMentorDto } from './dto/update-courseMentor.dto';


@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async getCourses(
        offset?: number,
        limit?: number,
        search?: string,
        level?: CourseLevel,
        category_id?: number,
        mentor_id?: number,
        priceMin?: Decimal | number,
        priceMax?: Decimal | number,
    ) {
        const where: any = {
            published: true,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { about: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (level) {
            where.level = level;
        }

        if (category_id) {
            where.categoryId = category_id;
        }

        if (mentor_id) {
            where.mentorId = mentor_id;
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            where.price = {};
            if (priceMin !== undefined) where.price.gte = priceMin;
            if (priceMax !== undefined) where.price.lte = priceMax;
        }

        const result = await this.prisma.course.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                category: { select: { id: true, name: true } },
                mentor: { select: { id: true, image: true, fullName: true } },
                _count: { select: { purchased: true } },
            },
        });

        return {
            success: true,
            data: result,
        };
    }

    async getOneById(id: string) {
        const existsCourse = await this.prisma.course.findUnique({
            where: {
                id,
                published: true
            },
            include:
            {
                category:
                {
                    select:
                    {
                        id: true,
                        name: true
                    }
                }, mentor:
                {
                    select:
                    {
                        id: true,
                        image: true,
                        fullName: true
                    }
                }, _count: {
                    select:
                        { purchased: true }
                }
            }
        })
        if (!existsCourse) throw new NotFoundException("course not found!")

        return {
            success: true,
            data: existsCourse
        }
    }
    async getFullId(id: string) {
        const existsCourse = await this.prisma.course.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                banner: true,
                price: true,
                published: true,
                assigned: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                image: true,
                                phone: true
                            }
                        }
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                mentor: {
                    select: {
                        id: true,
                        image: true,
                        fullName: true
                    }
                },
                _count: {
                    select: { purchased: true }
                }
            }
        });
        if (!existsCourse) throw new NotFoundException("course not found!");

        return {
            success: true,
            data: existsCourse
        }
    }
    async courses(
        offset?: number,
        limit?: number,
        search?: string,
        level?: CourseLevel,
        category_id?: number,
        mentor_id?: number,
        priceMin?: Decimal | number,
        priceMax?: Decimal | number,
        published?: Boolean
    ) {
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { about: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (level) {
            where.level = level;
        }

        if (category_id) {
            where.categoryId = category_id;
        }

        if (mentor_id) {
            where.mentorId = mentor_id;
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            where.price = {};
            if (priceMin !== undefined) where.price.gte = priceMin;
            if (priceMax !== undefined) where.price.lte = priceMax;
        }

        if (published !== undefined) {
            where.published = published;
        }
        const result = await this.prisma.course.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                category: { select: { id: true, name: true } },
                mentor: { select: { id: true, image: true, fullName: true } },
                _count: { select: { purchased: true } },
            },
        });

        return {
            success: true,
            data: result,
        };
    }
    async myCourses(
        userId: number,
        offset?: number,
        limit?: number,
        search?: string,
        level?: CourseLevel,
        category_id?: number,
        mentor_id?: number,
        priceMin?: Decimal | number,
        priceMax?: Decimal | number,
        published?: boolean
    ) {
        const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!existsUser) throw new NotFoundException('user not found!')

        const where: any = {}

        if (existsUser.role === UserRole.MENTOR) {
            where.mentorId = userId
        }

        if (existsUser.role === UserRole.ADMIN && mentor_id) {
            where.mentorId = mentor_id
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { about: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (level) {
            where.level = level;
        }

        if (category_id) {
            where.categoryId = category_id;
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            where.price = {};
            if (priceMin !== undefined) where.price.gte = priceMin;
            if (priceMax !== undefined) where.price.lte = priceMax;
        }

        if (published !== undefined) {
            where.published = published;
        }

        const result = await this.prisma.course.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                assigned: { include: { user: { select: { id: true, fullName: true, phone: true } } } },
                category: { select: { id: true, name: true } },
                mentor: { select: { id: true, image: true, fullName: true } },
                _count: { select: { purchased: true } },
            },
        });

        return {
            success: true,
            data: result,
        };
    }
    async getMentorIdCourses(mentor_id: number) {
        const existsMentor = await this.prisma.mentorProfile.findUnique({ where: { userId: mentor_id } })
        if (!existsMentor) throw new NotFoundException("mentor not dound")

        const result = await this.prisma.course.findMany({ where: { mentorId: mentor_id }, include: { assigned: { include: { user: { select: { id: true, fullName: true } } } }, category: { select: { id: true, name: true } } } })
        if (!result) throw new NotFoundException("mentor's course not found!")
        return {
            success: true,
            data: result
        }
    }
    async getMyAssigned(
        userId: number,
        offset?: number,
        limit?: number,
        search?: string,
        level?: CourseLevel,
        category_id?: number,
        mentor_id?: number,
        priceMin?: Decimal | number,
        priceMax?: Decimal | number,
        published?: boolean
    ) {
        const existsUser = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!existsUser) throw new NotFoundException('user not found!')

        const where: any = {}

        if (existsUser.role === UserRole.MENTOR) {
            where.mentorId = userId
        }

        if (existsUser.role === UserRole.ADMIN && mentor_id) {
            where.mentorId = mentor_id
        }
        if (existsUser.role === UserRole.ASSISTANT) {
            where.mentorId = userId
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { about: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (level) {
            where.level = level;
        }

        if (category_id) {
            where.categoryId = category_id;
        }

        if (priceMin !== undefined || priceMax !== undefined) {
            where.price = {};
            if (priceMin !== undefined) where.price.gte = priceMin;
            if (priceMax !== undefined) where.price.lte = priceMax;
        }

        if (published !== undefined) {
            where.published = published;
        }

        const result = await this.prisma.course.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                assigned: { include: { user: { select: { id: true, fullName: true, phone: true } } } },
                category: { select: { id: true, name: true } },
                mentor: { select: { id: true, image: true, fullName: true } },
                _count: { select: { purchased: true } },
            },
        });

        return {
            success: true,
            data: result,
        };
    }
    async getCourseIdAsisant(courseId: string, offset?: number, limit?: number) {
        const existsCourse = await this.prisma.course.findUnique({ where: { id: courseId } })
        if (!existsCourse) throw new NotFoundException("course not found!")
        const result = await this.prisma.assignedCourse.findMany({ where: { courseId: courseId }, skip: offset, take: limit })
        if (!result) throw new NotFoundException("course's assistants not found!")

        return {
            success: true,
            data: result
        }
    }
    async createCourseAssisent(payload: CreateAssisantDto) {
        const existsAsisants = await this.prisma.user.findUnique({ where: { id: payload.assistantId } })
        if (!existsAsisants) throw new NotFoundException("this assisan not found!")

        const existsCourse = await this.prisma.course.findUnique({ where: { id: payload.courseId } })
        if (!existsCourse) throw new NotFoundException('course not found!')

        const result = await this.prisma.assignedCourse.create({
            data: {
                courseId: payload.courseId,
                userId: payload.assistantId
            }
        })
        return {
            success: true,
            data: result
        }

    }
    async deleteAssisant(payload: CreateAssisantDto) {
        const existsAsisants = await this.prisma.user.findUnique({ where: { id: payload.assistantId } })
        if (!existsAsisants) throw new NotFoundException("this assisan not found!")

        const existsCourse = await this.prisma.course.findUnique({ where: { id: payload.courseId } })
        if (!existsCourse) throw new NotFoundException('course not found!')

        await this.prisma.assignedCourse.delete({
            where: {
                userId_courseId: {
                    courseId: payload.courseId,
                    userId: payload.assistantId
                }
            }

        })
        return {
            success: true,
            message: "successfully seperated"
        }
    }
    async createCourse(payload: CreateCourseDto, banner: string, introVideo?: string) {
        const existsMentor = await this.prisma.user.findUnique({ where: { id: payload.mentorId } })
        if (!existsMentor) throw new NotFoundException("this mentor not found!")

        const existsCategory = await this.prisma.courseCategory.findUnique({ where: { id: payload.categoryId } })
        if (!existsCategory) throw new NotFoundException('category not found!')

        const BASE_URL = 'http://localhost:3000/uploads/';

        const bannerUrl = banner ? `${BASE_URL}${banner}` : null;
        const introVideoUrl = introVideo ? `${BASE_URL}${introVideo}` : null;

        const course = await this.prisma.course.create({
            data: {
                ...payload,
                banner: bannerUrl!,
                introVideo: introVideoUrl,
            }
        });

        return {
            success: true,
            data: course
        };
    }
    async updateCourse(id: string, payload: UpdateCourseDto, banner?: string, introVideo?: string) {
        const existsMentor = await this.prisma.user.findUnique({ where: { id: payload.mentorId } });
        if (!existsMentor) throw new NotFoundException("this mentor not found!");

        const existsCategory = await this.prisma.courseCategory.findUnique({ where: { id: payload.categoryId } });
        if (!existsCategory) throw new NotFoundException('category not found!');

        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) throw new NotFoundException('Course not found!');

        if ((banner && course.banner && banner !== course.banner) ||
            (introVideo && course.introVideo && introVideo !== course.introVideo)) {

            if (banner && course.banner && banner !== course.banner) {
                const bannerPath = path.join(process.cwd(), 'uploads', course.banner);
                if (fs.existsSync(bannerPath)) fs.unlinkSync(bannerPath);
            }

            if (introVideo && course.introVideo && introVideo !== course.introVideo) {
                const videoPath = path.join(process.cwd(), 'uploads', course.introVideo);
                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            }
        }

        const updated = await this.prisma.course.update({
            where: { id },
            data: {
                ...payload,
                banner: banner || course.banner,
                introVideo: introVideo || course.introVideo,
            },
        });

        return updated;
    }
    async publishedCourse(id: string) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) throw new NotFoundException('Course not found!');

        const published = await this.prisma.course.update({ where: { id }, data: { published: true } })
        return {
            success: true,
            data: published
        }
    }
    async unPublishedCourse(id: string) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) throw new NotFoundException('Course not found!');

        const unPublished = await this.prisma.course.update({ where: { id }, data: { published: false } })
        return {
            success: true,
            data: unPublished
        }
    }
    async updateCourseMentor(payload: UpdateCourseMentorDto) {
        const course = await this.prisma.course.findUnique({
            where: { id: payload.courseId }
        });
        if (!course) throw new NotFoundException('Course not found!');

        const existsMentor = await this.prisma.user.findUnique({
            where: { id: payload.userId }
        });
        if (!existsMentor) throw new NotFoundException("This mentor not found!");

        const assigned = await this.prisma.assignedCourse.findFirst({
            where: { courseId: payload.courseId }
        });

        if (assigned) {
            await this.prisma.assignedCourse.delete({
                where: {
                    userId_courseId: {
                        userId: assigned.userId,
                        courseId: payload.courseId
                    }
                }
            });
        }

        await this.prisma.assignedCourse.create({
            data: {
                userId: payload.userId,
                courseId: payload.courseId
            }
        });

        return {
            success: true,
            message: 'Mentor successfully updated'
        };
    }

    async deleteCourses(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id }
        });
        if (!course) throw new NotFoundException('Course not found!');

        await this.prisma.course.delete({ where: { id } });

        return {
            success: true,
            message: 'Course and all related data successfully deleted'
        };
    }




}
