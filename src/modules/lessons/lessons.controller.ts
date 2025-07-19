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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @Roles('STUDENT')
    @Get(':id')
    async getOneById(
        @Param('id') id: string,
        @Query('userId', ParseIntPipe) userId: number,
    ) {
        return this.lessonsService.getOneById(id, userId);
    }

    @Roles('STUDENT')
    @Get(':id/views')
    async getOneLessonViews(
        @Param('id') id: string,
        @Query('userId', ParseIntPipe) userId: number,
    ) {
        return this.lessonsService.getOneLessonViews(id, userId);
    }

    @Roles('ADMIN', 'MENTOR')
    @Get(':id/details')
    async getAllDetails(@Param('id') id: string) {
        return this.lessonsService.getAllDetails(id);
    }
    @Roles('ADMIN', 'MENTOR')
    @Delete(':id')
    async deleteLesson(@Param('id') id: string) {
        return this.lessonsService.delteLesson(id);
    }
    @Roles('ADMIN', 'MENTOR')
    @Post('create')
    @UseInterceptors(FileInterceptor('video', videoStorage))
    async create(@Body() payload: CreateLessonDto, @UploadedFile() video: Express.Multer.File) {
        return this.lessonsService.createLesson(payload, video.filename)
    }
    @Roles('ADMIN', 'MENTOR')
    @Patch('update/:id')
    @UseInterceptors(FileInterceptor('video', videoStorage))
    async updates(@Param('id') id: string, @Body() payload: UpdateLessonDto, @UploadedFile() video: Express.Multer.File) {
        return this.lessonsService.updateLessons(payload, video.filename, id)
    }
}
