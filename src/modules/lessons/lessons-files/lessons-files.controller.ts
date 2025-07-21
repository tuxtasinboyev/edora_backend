import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LessonsFilesService } from './lessons-files.service';
import { CreateLessonsFileDto } from './dto/create-lessons-file.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'src/common/utils/helper/helper';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Lesson Files')
@ApiBearerAuth()
@Controller('lessons-files')
export class LessonsFilesController {
  constructor(private readonly lessonsFilesService: LessonsFilesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @UseInterceptors(FileInterceptor('file', fileStorage))
  @Post('create')
  @ApiOperation({ summary: 'Upload a file to a lesson' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: { type: 'string', example: 'lesson123' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
      required: ['lessonId', 'file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Lesson file created successfully' })
  async create(
    @Body() createLessonsFileDto: CreateLessonsFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.lessonsFilesService.createLessonFile(
      createLessonsFileDto,
      file.filename,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Get('lesson/:lessonId')
  @ApiOperation({ summary: 'Get all files for a specific lesson' })
  @ApiParam({ name: 'lessonId', type: String })
  findAll(@Param('lessonId') lessonId: string) {
    return this.lessonsFilesService.findAll(lessonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson file by ID' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.lessonsFilesService.remove(+id);
  }
}
