import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { PurchasedService } from './purchased.service';
import { CreatePurchasedCourseDto, PurchaseCourseDto } from './dto/create-purchased.dto';
import { UpdatePurchasedDto } from './dto/update-purchased.dto';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@Controller('purchased')
export class PurchasedController {
  constructor(private readonly purchasedService: PurchasedService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('purchase')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Purchase a course (STUDENT)' })
  @ApiResponse({ status: 201, description: 'Course purchased successfully' })
  @ApiResponse({ status: 400, description: 'Course already purchased or invalid request' })
  @ApiBody({
    type: PurchaseCourseDto,
    examples: {
      valid: {
        summary: 'Valid Payload',
        value: { courseId: 'course_abc123' },
      },
    },
  })
  async purchaseCourse(@Req() req, @Body() body: PurchaseCourseDto) {
    const userId = req.user?.id;
    return this.purchasedService.purchaseCourse(userId, body.courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('purchased-courses/mine')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get my purchased courses (STUDENT)' })
  @ApiQuery({ name: 'offset', required: false, type: String, example: '0' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '8' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'NestJS' })
  @ApiQuery({ name: 'category_id', required: false, type: String, example: '2' })
  @ApiQuery({
    name: 'level',
    required: false,
    enum: ['BEGINNER', 'PRE_INTERMEDIATE', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED'],
  })
  async getPurchasedCourses(
    @Req() req,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category_id') category_id?: string,
    @Query('level') level?: CourseLevel,
  ) {
    const userId = req.user?.id;

    return this.purchasedService.purchasedCoursedMine(
      userId,
      offset ? +offset : 0,
      limit ? +limit : 8,
      search,
      category_id ? +category_id : undefined,
      level,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('purchased-courses/mine/:course_id')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get specific purchased course (STUDENT)' })
  @ApiParam({ name: 'course_id', type: String, required: true })
  async getPurchasedCourseById(
    @Req() req,
    @Param('course_id') courseId: string,
  ) {
    const userId = req.user?.id;
    return this.purchasedService.getPurchasedCourseById(userId, courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('course/:id/students')
  @Roles('MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Get list of students who purchased this course' })
  @ApiParam({ name: 'id', description: 'Course ID', type: String, required: true })
  @ApiQuery({ name: 'offset', required: false, type: String, example: '0' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '8' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of students returned successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getCourseStudents(
    @Param('id') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.purchasedService.getStudentsByCourseId(
      courseId,
      offset ? +offset : 0,
      limit ? +limit : 8,
      search,
    );
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create purchased course manually by ADMIN (paid via CASH)' })
  @ApiResponse({ status: 201, description: 'Course purchased successfully' })
  @ApiResponse({ status: 404, description: 'User or course not found' })
  createPurchasedCourse(@Body() dto: CreatePurchasedCourseDto) {
    return this.purchasedService.createPurchasedCourseCash(dto);
  }
}
