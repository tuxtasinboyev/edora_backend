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

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Create a new mentor' })
  @ApiResponse({ status: 201, description: 'Mentor created successfully' })
  @ApiBody({ type: CreateMentorDto })
  createMentor(@Body() dto: CreateMentorDto) {
    return this.userService.createMentor(dto);
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
  @Roles('ADMIN')
  @Put('mentor/:id')
  @ApiOperation({ summary: 'Update mentor profile' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMentorDto })
  updateMentorProfile(@Param('id') id: number, @Body() dto: UpdateMentorDto) {
    return this.userService.updateMentorProfile(Number(id), dto);
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
