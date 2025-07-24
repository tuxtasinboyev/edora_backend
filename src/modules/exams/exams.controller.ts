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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import {
  CreateExamDto,
  CreateManyExamDto,
  PassExamDto,
} from './dto/create-exam.dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto/update-exam.dto';
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
} from '@nestjs/swagger';

@ApiTags('Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exams')
export class ExamsController {
  constructor(private examService: ExamsService) { }

  @Get('lesson-group/:lessonGroupId')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get exam by lesson group ID' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  async getByLessonGroup(
    @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
    @Req() req,
  ) {
    return this.examService.getExamLessonGroupByLessonGroupId(
      lessonGroupId,
      req.user.id,
    );
  }

  @Post('pass')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Submit answers and pass exam' })
  async passExam(
    @Body() payload: PassExamDto,
    @Req() req,
  ) {
    return this.examService.pass(payload, req.user.id);
  }

  @Post()
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Create one exam' })
  async createExam(@Body() payload: CreateExamDto) {
    return this.examService.createExam(payload);
  }

  @Post('createManyExam')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Create many exams at once' })
  async createManyExam(@Body() payload: CreateManyExamDto) {
    return this.examService.createManyExam(payload);
  }

  @Get('details/:lessonGroupId')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Get all exam details by lesson group ID' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  async getAllExamDetails(
    @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
  ) {
    return this.examService.getAllExamDetails(lessonGroupId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getdetailById(id);
  }

  @Put(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Update exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  async updateExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateExamDto,
  ) {
    return this.examService.updateExam(id, payload);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Delete exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  async deleteExam(@Param('id', ParseIntPipe) id: number) {
    return this.examService.deleteExamById(id);
  }
@Get('results')
@Roles('ADMIN')
@ApiOperation({ summary: 'Get all exam results (admin only)' })
@ApiQuery({ name: 'offset', required: false, type: String })
@ApiQuery({ name: 'limit', required: false, type: String })
@ApiQuery({ name: 'lesson_group_id', required: false, type: String })
@ApiQuery({ name: 'passed', required: false, type: String })
async getResults(
  @Req() req,
  @Query('offset') offset?: string,
  @Query('limit') limit?: string,
  @Query('lesson_group_id') lessonGroupId?: string,
  @Query('passed') passed?: string,
) {
  return this.examService.getResults(
    req.user.id,
    offset && !isNaN(+offset) ? +offset : 0,
    limit && !isNaN(+limit) ? +limit : 8,
    lessonGroupId && !isNaN(+lessonGroupId) ? +lessonGroupId : undefined,
    passed === 'true' ? true : passed === 'false' ? false : undefined,
  );
}








  @Get('results/lesson-group/:id')
  @Roles('MENTOR')
  @ApiOperation({ summary: 'Get exam results for a lesson group (mentor only)' })
  @ApiParam({ name: 'id', type: Number })
  async getResultsByGroup(
    @Param('id', ParseIntPipe) lessonGroupId: number,
    @Query() query: any,
  ) {
    return this.examService.getResultsByLessonGroup(lessonGroupId, query);
  }
}
