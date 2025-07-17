import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseCategoryService } from './course_category.service';
import { CreateCourseCategoryDto } from './dto/create-course_category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course_category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

@Controller('course-category')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post("category-create")
  create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return this.courseCategoryService.create(createCourseCategoryDto);
  }

  @Get("getAll")
  findAll() {
    return this.courseCategoryService.findAll();
  }

  @Get('getOne:name')
  findOne(@Param('name') name: string) {
    return this.courseCategoryService.findOne(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseCategoryDto: UpdateCourseCategoryDto) {
    return this.courseCategoryService.update(+id, updateCourseCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseCategoryService.remove(+id);
  }
}
