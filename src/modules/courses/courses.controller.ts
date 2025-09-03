import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  ParseFloatPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';
import { UpdateCourseMentorDto } from './dto/update-courseMentor.dto';
import { CreateAssisantDto } from './dto/create-asisant';
import { multerStorages } from 'src/common/utils/helper/helper';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all courses with filters' })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, type: String })
  @ApiQuery({ name: 'category_id', required: false, type: Number })
  @ApiQuery({ name: 'mentor_id', required: false, type: Number })
  @ApiQuery({ name: 'priceMin', required: false, type: Number })
  @ApiQuery({ name: 'priceMax', required: false, type: Number })
  getCourses(
    @Query('offset', new DefaultValuePipe(0),) offset: string,
    @Query('limit', new DefaultValuePipe(8),) limit: string,
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('category_id',) category_id?: string,
    @Query('mentor_id',) mentor_id?: string,
    @Query('priceMin',) priceMin?: string,
    @Query('priceMax',) priceMax?: string,
  ) {
    return this.courseService.getCourses(
      +offset,
      +limit,
      search,
      level as any,
      +category_id!,
      +mentor_id!,
      +priceMin!,
      +priceMax!,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR', 'ASSISTANT')
  @Get('full/:id')
  @ApiParam({ name: 'id' })
  getFullId(@Param('id') id: string) {
    return this.courseService.getFullId(id);
  }

  @Get('sigle/:id')
  @ApiParam({ name: 'id' })
  getOneById(@Param('id') id: string) {
    return this.courseService.getOneById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Post()
  @UseInterceptors(AnyFilesInterceptor({ storage: multerStorages() }))
  @ApiOperation({ summary: 'Create new course with files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'JavaScript for Beginners' },
        about: { type: 'string', example: 'Learn JS basics' },
        price: { type: 'string', example: '49.99' },
        level: {
          type: 'string',
          enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
          example: 'BEGINNER',
        },
        categoryId: { type: 'number', example: 1 },
        published: { type: 'boolean', example: true },
        mentorId: { type: 'number', example: 5 },
        banner: { type: 'string', format: 'binary' },
        introVideo: { type: 'string', format: 'binary' },
      },
      required: [
        'name',
        'about',
        'price',
        'level',
        'categoryId',
        'published',
        'mentorId',
        'banner',
      ],
    },
  })

  createCourse(
    @Body() payload: CreateCourseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const banner = files.find((file) => file.fieldname === 'banner')?.filename;
    const introVideo = files.find((file) => file.fieldname === 'introVideo')?.filename;

    return this.courseService.createCourse(payload, banner!, introVideo);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor({ storage: multerStorages() }))
  @ApiOperation({ summary: 'Update course by ID with files' })
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        banner: {
          type: 'string',
          format: 'binary',
          description: 'Updated course banner image',
        },
        introVideo: {
          type: 'string',
          format: 'binary',
          description: 'Updated course introduction video',
        },
        name: { type: 'string', example: 'Updated course name' },
        about: { type: 'string', example: 'Updated about' },
        price: { type: 'string', example: '49.99' },
        level: {
          type: 'string',
          enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
          example: 'BEGINNER',
        },
        categoryId: { type: 'number', example: 1 },
        published: { type: 'boolean', example: true },
        mentorId: { type: 'number', example: 5 },
      },
    },
  })

  updateCourse(
    @Param('id') id: string,
    @Body() payload: UpdateCourseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const banner = files?.find((file) => file.fieldname === 'banner')?.filename;
    const introVideo = files?.find((file) => file.fieldname === 'introVideo')?.filename;

    return this.courseService.updateCourse(id, payload, banner!, introVideo);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('published/:id')
  @ApiParam({ name: 'id' })
  publishedCourse(@Param('id') id: string) {
    return this.courseService.publishedCourse(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('unpublished/:id')
  @ApiParam({ name: 'id' })
  unPublishedCourse(@Param('id') id: string) {
    return this.courseService.unPublishedCourse(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('mentor')
  @ApiOperation({ summary: 'Update course mentor' })
  updateMentor(@Body() payload: UpdateCourseMentorDto) {
    return this.courseService.updateCourseMentor(payload);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Post('assistant')
  @ApiOperation({ summary: 'Assign assistant to course' })
  createAssistant(@Body() payload: CreateAssisantDto) {
    return this.courseService.createCourseAssisent(payload);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Delete('assistant')
  @ApiOperation({ summary: 'Remove assistant from course' })
  deleteAssistant(@Body() payload: CreateAssisantDto) {
    return this.courseService.deleteAssisant(payload);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourses(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Get(':id/assistants')
  @ApiParam({ name: 'id' })
  getAssistants(@Param('id') courseId: string) {
    return this.courseService.getCourseIdAsisant(courseId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('mentor/:mentorId')
  @ApiParam({ name: 'mentorId', type: Number })
  getMentorCourses(@Param('mentorId', ParseIntPipe) mentorId: number) {
    return this.courseService.getMentorIdCourses(mentorId);
  }

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MENTOR')
@Get('my-courses/:userId')
@ApiOperation({ summary: 'Get courses created by logged-in mentor' })

@ApiQuery({ name: 'offset', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'search', required: false, type: String })
@ApiQuery({ name: 'level', required: false, type: String })
@ApiQuery({ name: 'category_id', required: false, type: Number })
@ApiQuery({ name: 'mentor_id', required: false, type: Number })
@ApiQuery({ name: 'priceMin', required: false, type: Number })
@ApiQuery({ name: 'priceMax', required: false, type: Number })
@ApiQuery({ name: 'published', required: false, type: Boolean })

myCourses(
  @Req() req,
  @Query('offset') offset?: number,
  @Query('limit') limit?: number,
  @Query('search') search?: string,
  @Query('level') level?: string,
  @Query('category_id', ParseIntPipe) category_id?: number,
  @Query('mentor_id', ParseIntPipe) mentor_id?: number,
  @Query('priceMin') priceMin?: number,
  @Query('priceMax') priceMax?: number,
  @Query('published') published?: boolean,
) {
  return this.courseService.myCourses(
    req.user.id,
    offset,
    limit,
    search,
    level as any,
    category_id,
    mentor_id,
    priceMin,
    priceMax,
    published,
  );
}


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ASSISTANT')
  @Get('my-assigned/:userId')
  @ApiOperation({ summary: 'Get assistant\'s assigned courses' })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getMyAssigned(
    @Req() req,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('category_id', ParseIntPipe) category_id?: number,
    @Query('mentor_id', ParseIntPipe) mentor_id?: number,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
    @Query('published') published?: boolean,
  ) {
    return this.courseService.getMyAssigned(
      req.user.id,
      offset,
      limit,
      search,
      level as any,
      category_id,
      mentor_id,
      priceMin,
      priceMax,
      published,
    );
  }
}
