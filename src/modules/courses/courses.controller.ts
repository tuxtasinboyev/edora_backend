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
    UploadedFile,
    UseInterceptors,
    UseGuards,
    UploadedFiles,
    Req
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto/update-course.dto';
import { UpdateCourseMentorDto } from './dto/update-courseMentor.dto';
import { CreateAssisantDto } from './dto/create-asisant';
import { multerStorage, multerStorages } from 'src/common/utils/helper/helper';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CoursesService) { }

    @Get()
    getCourses(
        @Query('offset') offset?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
        @Query('level') level?: string,
        @Query('category_id', ParseIntPipe) category_id?: number,
        @Query('mentor_id', ParseIntPipe) mentor_id?: number,
        @Query('priceMin') priceMin?: number,
        @Query('priceMax') priceMax?: number,
    ) {
        return this.courseService.getCourses(
            offset,
            limit,
            search,
            level as any,
            category_id,
            mentor_id,
            priceMin,
            priceMax
        );
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR', "ASSISTANT")
    @Get('full/:id')
    getFullId(@Param('id') id: string) {
        return this.courseService.getFullId(id);
    }

    @Get('sigle/:id')
    getOneById(@Param('id') id: string) {
        return this.courseService.getOneById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    @Post()
    @UseInterceptors(AnyFilesInterceptor({ storage: multerStorages() }))
    async createCourse(
        @Body() payload: CreateCourseDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const banner = files.find((file) => file.fieldname === 'banner')?.filename;
        const introVideo = files.find((file) => file.fieldname === 'introVideo')?.filename;

        return this.courseService.createCourse(payload, banner!, introVideo);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    @Put(':id')
    @UseInterceptors(AnyFilesInterceptor({ storage: multerStorages() }))
    updateCourse(
        @Param('id') id: string,
        @Body() payload: UpdateCourseDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const banner = files.find((file) => file.fieldname === 'banner')?.filename;
        const introVideo = files.find((file) => file.fieldname === 'introVideo')?.filename;

        return this.courseService.updateCourse(id, payload, banner!, introVideo);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put('published/:id')
    publishedCourse(@Param('id') id: string) {
        return this.courseService.publishedCourse(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put('unpublished/:id')
    unPublishedCourse(@Param('id') id: string) {
        return this.courseService.unPublishedCourse(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put('mentor')
    updateMentor(@Body() payload: UpdateCourseMentorDto) {
        return this.courseService.updateCourseMentor(payload);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    @Post('assistant')
    createAssistant(@Body() payload: CreateAssisantDto) {
        return this.courseService.createCourseAssisent(payload);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    @Delete('assistant')
    deleteAssistant(@Body() payload: CreateAssisantDto) {
        return this.courseService.deleteAssisant(payload);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    @Delete(':id')
    deleteCourse(@Param('id') id: string) {
        return this.courseService.deleteCourses(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    @Get(':id/assistants')
    getAssistants(@Param('id') courseId: string) {
        return this.courseService.getCourseIdAsisant(courseId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('mentor/:mentorId')
    getMentorCourses(@Param('mentorId', ParseIntPipe) mentorId: number) {
        return this.courseService.getMentorIdCourses(mentorId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    @Get('my-courses/:userId')
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
            published
        );
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ASSISTANT")
    @Get('my-assigned/:userId')
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
            published
        );
    }
}
