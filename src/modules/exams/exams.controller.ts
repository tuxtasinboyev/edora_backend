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
@Controller('exams')
export class ExamsController {
  constructor(private examService: ExamsService) { }

  @ApiBearerAuth()
  @Get('lesson-group/:lessonGroupId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get exam by lesson group ID' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  @ApiQuery({ name: 'user_id', type: String })
  async getByLessonGroup(
    @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
    @Query('user_id') userId: string,
  ) {
    return this.examService.getExamLessonGroupByLessonGroupId(
      lessonGroupId,
      +userId,
    );
  }

  @ApiBearerAuth()
  @Post('pass')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Submit answers and pass exam' })
  @ApiQuery({ name: 'user_id', type: String })
  async passExam(
    @Body() payload: PassExamDto,
    @Query('user_id') userId: string,
  ) {
    return this.examService.pass(payload, +userId);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Create one exam' })
  async createExam(@Body() payload: CreateExamDto) {
    return this.examService.createExam(payload);
  }

  @ApiBearerAuth()
  @Post('createManyExam')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Create many exams at once' })
  async createManyExam(@Body() payload: CreateManyExamDto) {
    return this.examService.createManyExam(payload);
  }

  @ApiBearerAuth()
  @Get('details/:lessonGroupId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Get all exam details by lesson group ID' })
  @ApiParam({ name: 'lessonGroupId', type: Number })
  async getAllExamDetails(
    @Param('lessonGroupId', ParseIntPipe) lessonGroupId: number,
  ) {
    return this.examService.getAllExamDetails(lessonGroupId);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getdetailById(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Update exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  async updateExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateExamDto,
  ) {
    return this.examService.updateExam(id, payload);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @ApiOperation({ summary: 'Delete exam by ID' })
  @ApiParam({ name: 'id', type: Number })
  async deleteExam(@Param('id', ParseIntPipe) id: number) {
    return this.examService.deleteExamById(id);
  }

  @ApiBearerAuth()
  @Get('results')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all exam results (admin only)' })
  async getResults(@Query() query: any) {
    return this.examService.getResults(query);
  }

  @ApiBearerAuth()
  @Get('results/lesson-group/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
