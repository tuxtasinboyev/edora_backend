import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Post('create')
  create(@Body() createRatingDto: CreateRatingDto, @Req() req: any) {
    return this.ratingService.create(createRatingDto, req.user.id);
  }

  @Get('all-list-latest')
  findAll() {
    return this.ratingService.findAll();
  }

  @Get('by-course/:courseId')
  getRatingListBy(
    @Param('courseId') courseId: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number
  ) {
    return this.ratingService.getRatingListBy(courseId, Number(offset), Number(limit));
  }

  @Get('course/:id')
  getCourseById(@Param('id') id: string) {
    return this.ratingService.getCourseById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingService.remove(+id);
  }
}
