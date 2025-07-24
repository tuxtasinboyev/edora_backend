import { Controller, Get, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('public/:name')
  @ApiOperation({ summary: 'Get public lesson files by name' })
  @ApiParam({ name: 'name', type: String, required: true, example: 'Intro to JS' })
  @ApiResponse({ status: 200, description: 'Returns list of lesson files' })
  publicFilesByName(@Param('name') name: string) {
    return this.filesService.publicName(name);
  }

  @Get('public/:lessonId/:name')
  @ApiOperation({ summary: 'Get public lesson files by name and lessonId' })
  @ApiParam({ name: 'lessonId', type: String, required: true, example: 'clz5f1234' })
  @ApiParam({ name: 'name', type: String, required: true, example: 'Intro to JS' })
  @ApiResponse({ status: 200, description: 'Returns list of lesson files with lessonId' })
  publicFilesByNameAndLessonId(
    @Param('lessonId') lessonId: string,
    @Param('name') name: string,
  ) {
    return this.filesService.getFileByNameWithByLessonId(name, lessonId);
  }
}
