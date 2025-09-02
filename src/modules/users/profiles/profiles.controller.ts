import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLastActivtyDto } from './dto/lastActivty-dto/update-lastActivtiy';
import { UpdatePasswordDto } from './dto/resent-password';
import { UpdateMentorProfileDto } from './dto/update-mentorProfie.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage } from 'src/common/utils/helper/helper';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { UpdatePhoneDto } from './dto/update-phone.dto';

import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }


  @Post('updatePhone')
  @ApiOperation({ summary: 'Telefon raqamni yangilash' })
  @ApiBody({ type: UpdatePhoneDto })
  @ApiResponse({ status: 200, description: 'OTP yuborildi, tasdiqlash kerak.' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi.' })
  async updatePhone(@Body() payload: UpdatePhoneDto, @Req() req) {
    return this.profilesService.phoneUpdate(payload, req.user.id);
  }

  @Post('confirmPhoneUpdate')
  @ApiOperation({ summary: 'Telefon raqamni yangilashni tasdiqlash' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'string', example: '123456' },
        phone: { type: 'string', example: '+998901234567' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Telefon raqami muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 400, description: 'OTP xato yoki muddati o‘tgan.' })
  async confirmPhoneUpdate(
    @Body('otp') otp: string,
    @Body('phone') phone: string,
    @Req() req
  ) {
    return this.profilesService.confirmPhoneUpdate(otp, phone, req.user.id);
  }

  @Get('me')
  async getMyProfile(@Req() req) {
    return this.profilesService.getMyProfile(req.user.id);
  }

  @Patch('me')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerStorage('image'),
      fileFilter(req, file, callback) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }

        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
      },
    },
  })
  async updateProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    const filename = file?.filename;
    return this.profilesService.update(req.user.id, dto, filename);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Get('me/last-activity')
  async getLastActivity(@Req() req) {
    return this.profilesService.getLastActivty(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @Patch('me/last-activity')
  async updateLastActivity(@Req() req, @Body() dto: UpdateLastActivtyDto) {
    return this.profilesService.updateLastActivty(dto, req.user.id);
  }

  @Patch('me/reset-password')
  async resetPassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.profilesService.resetPassword(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('me/mentor-profile')
  async updateMentorProfile(@Req() req, @Body() dto: UpdateMentorProfileDto) {
    return this.profilesService.updateMentorProfile(dto, req.user.id);
  }
}
