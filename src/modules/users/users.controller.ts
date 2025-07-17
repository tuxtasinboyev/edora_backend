// src/modules/users/users.controller.ts

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
import { UpdateMentorDto } from '../mentors/dto/update-mentor.dto/update-mentor.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('admin')
    createAdmin(@Body() dto: CreateUserDto) {
        return this.userService.createAdmin(dto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('mentor')
    createMentor(@Body() dto: CreateMentorDto) {
        return this.userService.createMentor(dto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', "MENTOR")
    @Post('assistant')
    createAssistant(@Body() dto: CreateAsisant) {
        return this.userService.createAsisant(dto);
    }

    @Get('mentors')
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
    getUserById(@Param('id') id: number) {
        return this.userService.getUserById(Number(id));
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', "MENTOR")
    @Get('phone/:phone')
    getUserByPhone(@Param('phone') phone: string) {
        return this.userService.getUserPhone(phone);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put('mentor/:id')
    updateMentorProfile(
        @Param('id') id: number,
        @Body() dto: UpdateMentorDto,
    ) {
        return this.userService.updateMentorProfile(Number(id), dto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.userService.deleteUserById(Number(id));
    }
}
