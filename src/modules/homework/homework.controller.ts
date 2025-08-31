import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { HomeworkService } from './homework.service';
import {
  CreateHomeworkDto,
  CreateHomeworkSubmissionDto,
  CheckAproved,
} from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { homeworkFile } from 'src/common/utils/helper/helper';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Homework')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post('create')
  @Roles('MENTOR', 'ADMIN')
  @UseInterceptors(FileInterceptor('file', homeworkFile))
  @ApiOperation({ summary: 'Create new homework for a lesson' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        lessonId: { type: 'string' },
        title: { type: 'string' },
        task: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['file', 'lessonId', 'title'],
    },
  })
  createHomework(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateHomeworkDto,
  ) {
    return this.homeworkService.createHommework(dto, file?.filename);
  }

  @Patch(':id')
  @Roles('MENTOR', 'ADMIN')
  @UseInterceptors(FileInterceptor('file', homeworkFile))
  @ApiOperation({ summary: 'Update existing homework' })
  @ApiParam({ name: 'id', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  updateHomework(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateHomeworkDto,
  ) {
    return this.homeworkService.update(+id, dto, file?.filename);
  }

  @Post('submission/submit/:lessonId')
  @Roles('STUDENT')
  @UseInterceptors(FileInterceptor('file', homeworkFile))
  @ApiOperation({ summary: 'Submit homework for a lesson' })
  @ApiParam({ name: 'lessonId', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        text: { type: 'string' },
        reason: { type: 'string' },
      },
      required: ['file'],
    },
  })
  submitHomework(
    @Param('lessonId') lessonId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() dto: CreateHomeworkSubmissionDto,
  ) {
    return this.homeworkService.submitHomework(
      lessonId,
      req.user.id,
      dto,
      file?.filename,
    );
  }

  @Get('course/:courseId')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get all homework by courseId' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  getHomeworkByCourseId(
    @Param('courseId') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.homeworkService.getHomeworkByCourseId(
      courseId,
      +offset! || 0,
      +limit! || 10,
    );
  }

  @Get('lesson/:lessonId/details')
  @Roles('STUDENT', 'MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Get full homework details by lessonId' })
  @ApiParam({ name: 'lessonId', type: String })
  getHomeworkDetails(@Param('lessonId') lessonId: string) {
    return this.homeworkService.getHommeworkAllDetails(lessonId);
  }

  @Get('mine-submissions/:lessonId')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get my homework submissions for a lesson' })
  @ApiParam({ name: 'lessonId', type: String })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  getMineSubmission(
    @Param('lessonId') lessonId: string,
    @Request() req,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.homeworkService.getMineSubmission(
      lessonId,
      req.user.id,
      +offset! || 0,
      +limit! || 8,
    );
  }

  @Get('submission')
  @Roles('MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Get all homework submissions (filterable)' })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'course_id', required: false, type: String })
  @ApiQuery({ name: 'homework_id', required: false, type: String })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  getAllSubmissions(@Query() query: any) {
    return this.homeworkService.getAllSubmissions(query);
  }

  @Get('submission/:id')
  @Roles('MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Get one homework submission by ID' })
  @ApiParam({ name: 'id', type: Number })
  getSubmissionOne(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.getSubmissionsOneById(id);
  }

  @Patch('submission/check')
  @Roles('MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Approve/Reject homework submission' })
  checkSubmission(@Body() dto: CheckAproved) {
    return this.homeworkService.checkSubmisionHommework(dto);
  }

  @Delete(':id')
  @Roles('MENTOR', 'ADMIN')
  @ApiOperation({ summary: 'Delete a homework by ID' })
  @ApiParam({ name: 'id', type: Number })
  deleteHomework(@Param('id', ParseIntPipe) id: number) {
    return this.homeworkService.remove(id);
  }
}
