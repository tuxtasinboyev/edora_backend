import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto, CreateManyExamDto, PassExamDto } from './dto/create-exam.dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto/update-exam.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

@Controller('exams')
export class ExamsController {
    constructor(private examService: ExamsService) { }

    @Get('lesson-group/:lessonGroupId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('STUDENT')
    async getByLessonGroup(
        @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
        @Query('user_id') userId: string
    ) {
        return this.examService.getExamLessonGroupByLessonGroupId(lessonGroupId, +userId);
    }

    @Post('pass')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('STUDENT')
    async passExam(
        @Body() payload: PassExamDto,
        @Query('user_id') userId: string
    ) {
        return this.examService.pass(payload, +userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    async createExam(@Body() payload: CreateExamDto) {
        return this.examService.createExam(payload);
    }

    @Post('bulk')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    async createManyExam(@Body() payload: CreateManyExamDto) {
        return this.examService.createManyExam(payload);
    }

    @Get('details/:lessonGroupId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    async getAllExamDetails(
        @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number
    ) {
        return this.examService.getAllExamDetails(lessonGroupId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.examService.getdetailById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    async updateExam(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateExamDto
    ) {
        return this.examService.updateExam(id, payload);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'MENTOR')
    async deleteExam(@Param('id', ParseIntPipe) id: number) {
        return this.examService.deleteExamById(id);
    }

    @Get('results')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async getResults(@Query() query: any) {
        return this.examService.getResults(query);
    }

    @Get('results/lesson-group/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('MENTOR')
    async getResultsByGroup(
        @Param('id', ParseIntPipe) lessonGroupId: number,
        @Query() query: any
    ) {
        return this.examService.getResultsByLessonGroup(lessonGroupId, query);
    }
}
