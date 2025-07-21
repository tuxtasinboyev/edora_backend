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

  // ... other methods unchanged ...

  @Post('create')
  @Roles('MENTOR', 'ADMIN')
  @UseInterceptors(FileInterceptor('file', homeworkFile))
  @ApiOperation({ summary: 'Create new homework for a lesson' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Homework file',
        },
        // Include other CreateHomeworkDto properties here if needed
        lessonId: { type: 'string', example: 'lesson123' }, // example, adjust as needed
        title: { type: 'string', example: 'Homework Title' },
        description: { type: 'string', example: 'Homework description' },
      },
      required: ['file', 'lessonId', 'title'], // required fields from CreateHomeworkDto
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
        file: {
          type: 'string',
          format: 'binary',
          description: 'Homework file',
        },
        // Include other UpdateHomeworkDto properties here if needed
        title: { type: 'string', example: 'Updated Homework Title' },
        description: { type: 'string', example: 'Updated description' },
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
        file: {
          type: 'string',
          format: 'binary',
          description: 'Submitted homework file',
        },
        // Include other CreateHomeworkSubmissionDto properties here if needed
        comments: { type: 'string', example: 'My submission comments' },
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

}
