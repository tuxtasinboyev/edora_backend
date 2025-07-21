import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { LessonsGroupService } from './lessons-group.service';
import { CreateLessonsGroupDto } from './dto/create-lessons-group.dto';
import { UpdateLessonsGroupDto } from './dto/update-lessons-group.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Lessons Group')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons-group')
export class LessonsGroupController {
  constructor(private readonly lessonsGroupService: LessonsGroupService) {}

  @Roles('ADMIN', 'MENTOR')
  @Post('create')
  @ApiOperation({ summary: 'Create a new lesson group' })
  create(@Body() createDto: CreateLessonsGroupDto) {
    return this.lessonsGroupService.create(createDto);
  }

  @Get('all/:courseId')
  @ApiOperation({ summary: 'Get all lesson groups by course ID' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'include_lessons', required: false, type: String })
  getAllByCourseId(
    @Param('courseId') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('include_lessons') include_lessons?: string,
  ) {
    return this.lessonsGroupService.getLessonsGroupAllByCourseId(
      courseId,
      offset ? parseInt(offset) : undefined,
      limit ? parseInt(limit) : undefined,
      include_lessons === 'true',
    );
  }

  @Roles('STUDENT')
  @Get('mine-all/:courseId')
  @ApiOperation({ summary: 'Get lesson groups of the logged-in student for a course' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'include_lessons', required: false, type: String })
  getMineByCourseId(
    @Req() req,
    @Param('courseId') courseId: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('include_lessons') include_lessons?: string,
  ) {
    const userId = req.user.id;
    return this.lessonsGroupService.getMineOneByCourseID(
      userId,
      courseId,
      offset ? parseInt(offset) : 0,
      limit ? parseInt(limit) : 10,
      include_lessons === 'true',
    );
  }

  @Get('details/:id')
  @ApiOperation({ summary: 'Get lesson group details by ID for the logged-in user' })
  @ApiParam({ name: 'id', type: Number })
  getDetails(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.lessonsGroupService.getLessonGroupDetails(userId, id);
  }

  @Roles('ADMIN', 'MENTOR')
  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson group by ID' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLessonsGroupDto,
  ) {
    return this.lessonsGroupService.update(id, updateDto);
  }

  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete lesson group by ID' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsGroupService.remove(id);
  }
}
