import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto/create-lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { videoStorage } from 'src/common/utils/helper/helper';
import { UpdateLessonDto } from './dto/update-lesson.dto/update-lesson.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @Roles('STUDENT')
  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID for student with view count' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'userId', type: Number })
  async getOneById(
    @Param('id') id: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.lessonsService.getOneById(id, userId);
  }

  @Roles('STUDENT')
  @Get(':id/views')
  @ApiOperation({ summary: 'Get lesson views for student' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'userId', type: Number })
  async getOneLessonViews(
    @Param('id') id: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.lessonsService.getOneLessonViews(id, userId);
  }

  @Roles('ADMIN', 'MENTOR')
  @Get(':id/details')
  @ApiOperation({ summary: 'Get all lesson details by ID (for admin/mentor)' })
  @ApiParam({ name: 'id', type: String })
  async getAllDetails(@Param('id') id: string) {
    return this.lessonsService.getAllDetails(id);
  }

  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiParam({ name: 'id', type: String })
  async deleteLesson(@Param('id') id: string) {
    return this.lessonsService.delteLesson(id);
  }

  @Roles('ADMIN', 'MENTOR')
  @Post('create')
  @UseInterceptors(FileInterceptor('video', videoStorage))
  @ApiOperation({ summary: 'Create a new lesson with video file' })
  async create(
    @Body() payload: CreateLessonDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.lessonsService.createLesson(payload, video.filename);
  }

  @Roles('ADMIN', 'MENTOR')
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('video', videoStorage))
  @ApiOperation({ summary: 'Update an existing lesson with new data and optional video' })
  @ApiParam({ name: 'id', type: String })
  async updates(
    @Param('id') id: string,
    @Body() payload: UpdateLessonDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.lessonsService.updateLessons(payload, video.filename, id);
  }
}
