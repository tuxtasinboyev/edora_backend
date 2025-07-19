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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons-group')
export class LessonsGroupController {
  constructor(private readonly lessonsGroupService: LessonsGroupService) { }

  @Roles('ADMIN', 'MENTOR')
  @Post('create')
  create(@Body() createDto: CreateLessonsGroupDto) {
    return this.lessonsGroupService.create(createDto);
  }

  @Get('all/:courseId')
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
  getDetails(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    return this.lessonsGroupService.getLessonGroupDetails(userId, id);
  }

  @Roles('ADMIN', 'MENTOR')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLessonsGroupDto,
  ) {
    return this.lessonsGroupService.update(id, updateDto);
  }

  @Roles('ADMIN', 'MENTOR')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsGroupService.remove(id);
  }
}
