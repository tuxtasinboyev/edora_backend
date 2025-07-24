import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  ParseIntPipe,
  ParseBoolPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateQuestionDto } from './dto/create-questions.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import {
  questionAnswerFile,
  questionFile,
} from 'src/common/utils/helper/helper';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Questions & Answers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('mine')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get current student’s questions' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  @ApiQuery({ name: 'answered', required: false, type: Boolean })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  getMineQuestions(
    @Req() req,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('read', ParseBoolPipe) read?: boolean,
    @Query('answered', ParseBoolPipe) answered?: boolean,
    @Query('courseId') courseId?: string,
  ) {
    const userId = req.user['id'];
    return this.questionsService.getMineQuestions(
      userId,
      Number(offset) || 0,
      Number(limit) || 8,
      read,
      answered,
      courseId,
    );
  }

  @Get('by-course/:courseId')
  @Roles('MENTOR', 'ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get all questions by courseId' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'read', required: false, type: Boolean })
  @ApiQuery({ name: 'answered', required: false, type: Boolean })
  getQuestionsByCourse(
    @Param('courseId') courseId: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('read', ParseBoolPipe) read?: boolean,
    @Query('answered', ParseBoolPipe) answered?: boolean,
  ) {
    return this.questionsService.getQuestiosByCourseId(
      courseId,
      Number(offset) || 0,
      Number(limit) || 8,
      read,
      answered,
    );
  }

  @Get('single/:id')
  @Roles('ADMIN', 'STUDENT', 'MENTOR', 'ASSISTANT')
  @ApiOperation({ summary: 'Get single question by ID' })
  @ApiParam({ name: 'id', type: Number })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.getOneById(id);
  }

  @Post('read/:id')
  @Roles('MENTOR', 'ADMIN', 'ASSISTANT')
  @ApiOperation({ summary: 'Mark question as read by assistant or mentor' })
  @ApiParam({ name: 'id', type: Number })
  read(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.readById(id);
  }

  // Create question with optional file upload
  @Post('create/:courseId')
  @Roles('STUDENT')
  @UseInterceptors(FileInterceptor('file', questionFile))
  @ApiOperation({ summary: 'Create new question for a course' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string', example: 'What is NestJS?' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional file upload',
        },
      },
      required: ['text'],
    },
  })
  create(
    @Param('courseId') courseId: string,
    @Req() req,
    @Body() payload: CreateQuestionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user['id'];
    return this.questionsService.createQuestions(
      userId,
      payload,
      courseId,
      file?.filename,
    );
  }

  // Update question with optional file upload
  @Patch('update/:id')
  @Roles('STUDENT')
  @UseInterceptors(FileInterceptor('file', questionFile))
  @ApiOperation({ summary: 'Update own question by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string', example: 'Updated question text' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional file upload',
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() payload: CreateQuestionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user['id'];
    return this.questionsService.updateQuestions(
      userId,
      payload,
      id,
      file?.filename,
    );
  }

  // Answer a question with optional file upload
  @Post('answer/:id')
  @Roles('ASSISTANT', 'MENTOR')
  @UseInterceptors(FileInterceptor('file', questionAnswerFile))
  @ApiOperation({ summary: 'Answer a question' })
  @ApiParam({ name: 'id', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string', example: 'Answer text here' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional file upload',
        },
      },
      required: ['text'],
    },
  })
  createAnswer(
    @Param('id', ParseIntPipe) questionId: number,
    @Req() req,
    @Body() payload: CreateQuestionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user['id'];
    return this.questionsService.createAnswer(
      questionId,
      userId,
      payload,
      file?.filename,
    );
  }

  @Delete('answer/delete/:questionId')
  @Roles('MENTOR', 'ASSISTANT', 'ADMIN')
  @ApiOperation({ summary: 'Delete answer by question ID' })
  @ApiParam({ name: 'questionId', type: Number })
  deleteAnswer(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.questionsService.deleteQuestionAnswer(questionId);
  }

  @Post('delete')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Delete all questions of logged-in student' })
  deleteMyQuestions(@Req() req) {
    const userId = req.user['id'];
    return this.questionsService.deleteQuestion(userId);
  }
}
