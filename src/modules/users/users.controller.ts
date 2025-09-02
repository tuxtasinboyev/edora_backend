import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { CreateMentorDto } from './dto/create-mentor.dto/create-mento.dto';
import { CreateAsisant } from './dto/create-asisant.dto/create-asissant.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { UpdateMentorDto } from './dto/create-mentor.dto/update-mentor.dto';
import { v4 as uuidv4 } from 'uuid';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin')
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  @ApiBody({ type: CreateUserDto })
  createAdmin(@Body() dto: CreateUserDto) {
    return this.userService.createAdmin(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('mentor')
  @ApiOperation({ summary: 'Create a new mentor and upload an image' })
  @ApiResponse({ status: 201, description: 'Mentor created successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new mentor and upload an image',
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '+998901234567', description: 'Telefon raqam (UZ)' },
        fullName: { type: 'string', example: 'Ali Valiyev', description: 'To‘liq ism' },
        password: { type: 'string', example: 'securePassword123', description: 'Parol' },
        experience: { type: 'number', example: 5, description: 'Ish tajribasi (yillar)' },
        job: { type: 'string', example: 'Frontend Developer', description: 'Kasbi' },
        telegram: { type: 'string', example: 'https://t.me/username', description: 'Telegram URL' },
        facebook: { type: 'string', example: 'https://facebook.com/username', description: 'Facebook URL' },
        instagram: { type: 'string', example: 'https://instagram.com/username', description: 'Instagram URL' },
        linkedin: { type: 'string', example: 'https://linkedin.com/in/username', description: 'LinkedIn URL' },
        github: { type: 'string', example: 'https://github.com/username', description: 'GitHub URL' },
        website: { type: 'string', example: 'https://mywebsite.com', description: 'Shaxsiy sayt URL' },
        file: { type: 'string', format: 'binary', description: 'Profile image (optional)' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/mentors',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    }),
  )
  async createMentor(
    @Body() dto: CreateMentorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createMentor(dto, file?.filename);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Post('assistant')
  @ApiOperation({ summary: 'Create a new assistant' })
  @ApiResponse({ status: 201, description: 'Assistant created successfully' })
  @ApiBody({ type: CreateAsisant })
  createAssistant(@Body() dto: CreateAsisant) {
    return this.userService.createAsisant(dto);
  }

  @Get('mentors')
  @ApiOperation({ summary: 'Get list of mentors' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  getMentors(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.userService.getUserMentors(offset, limit, search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  getAllUsers(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
  ) {
    return this.userService.getAll(offset, limit, search, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number })
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Get('phone/:phone')
  @ApiOperation({ summary: 'Get user by phone number' })
  @ApiParam({ name: 'phone', type: String })
  getUserByPhone(@Param('phone') phone: string) {
    return this.userService.getUserPhone(phone);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  @Put('mentor')
  @ApiOperation({ summary: 'Update mentor profile' })
  @ApiBody({ type: UpdateMentorDto })
  updateMentorProfile(@Req() req, @Body() dto: UpdateMentorDto) {
    const id = req.user.id;
    return this.userService.updateMentorProfile(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: Number })
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUserById(Number(id));
  }
}
