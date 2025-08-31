import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Course-Rating')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Post('create')
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiResponse({ status: 201, description: 'Rating created successfully' })
  create(@Body() createRatingDto: CreateRatingDto, @Req() req: any) {
    return this.ratingService.create(createRatingDto, req.user.id);
  }

  @Get('all-list-latest')
  @ApiOperation({ summary: 'Get all ratings sorted by latest' })
  @ApiResponse({ status: 200, description: 'List of all ratings' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Get('by-course/:courseId')
  @ApiOperation({ summary: 'Get ratings by course ID' })
  @ApiParam({ name: 'courseId', type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of ratings for the course' })
  getRatingListBy(
  @Param('courseId') courseId: string,
  @Query('offset') offset?: string,
  @Query('limit') limit?: string,
) {
  const skip = isNaN(Number(offset)) ? 0 : Number(offset);
  const take = isNaN(Number(limit)) ? 8 : Number(limit);
  return this.ratingService.getRatingListBy(courseId, skip, take);
}


  @Get('course/:id')
  @ApiOperation({ summary: 'Get course details by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Course details with rating info' })
  getCourseById(@Param('id') id: string) {
    return this.ratingService.getCourseById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete rating by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rating deleted successfully' })
  remove(@Param('id') id: string) {
    return this.ratingService.remove(+id);
  }
}
