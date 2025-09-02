import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserRole } from '@prisma/client';
import { CreateMentorDto } from './dto/create-mentor.dto/create-mento.dto';
import { CreateAsisant } from './dto/create-asisant.dto/create-asissant.dto';
import * as bcrypt from 'bcrypt';
import { UpdateMentorDto } from './dto/create-mentor.dto/update-mentor.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async createUser(payload: CreateUserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (existUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const userCreated = await this.prisma.user.create({
      data: { ...payload, password: hashedPassword },
    });

    const { password, ...safeUser } = userCreated;
    return {
      success: true,
      data: safeUser,
    };
  }

  async getUserMentors(offset?: number, limit?: number, search?: string) {
    const whereClause: any = {
      role: UserRole.MENTOR,
    };

    if (search) {
      whereClause.fullName = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const prismaQuery: any = {
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        mentorProfile: true,
      },
    };

    if (typeof offset === 'number') prismaQuery.skip = offset;
    if (typeof limit === 'number') prismaQuery.take = limit;

    const result = await this.prisma.user.findMany(prismaQuery);
    const safeUsers = result.map(({ password, ...user }) => user);
    return {
      success: true,
      count: result.length,
      data: safeUsers,
    };
  }

  async getMentorsById(id: number) {
    const existUser = await this.prisma.user.findUnique({
      where: { id },
      include: { mentorProfile: true },
    });
    if (!existUser) throw new NotFoundException('user not found!');

    return {
      success: true,
      data: existUser,
    };
  }
  async getAll(
    offset?: number,
    limit?: number,
    search?: string,
    role?: UserRole,
  ) {
    const whereClause: any = {};
    if (role) {
      whereClause.role = role;
    }

    if (search) {
      whereClause.fullName = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const prismaQuery: any = {
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        mentorProfile: true,
      },
    };

    if (typeof offset === 'number') prismaQuery.skip = offset;
    if (typeof limit === 'number') prismaQuery.take = limit;

    const result = await this.prisma.user.findMany(prismaQuery);
    const safeUsers = result.map(({ password, ...user }) => user);
    return {
      success: true,
      count: safeUsers.length,
      data: safeUsers,
    };
  }
  async getUserById(id: number) {
    const existsUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existsUser) throw new NotFoundException('user not found!');
    const { password, ...safeUser } = existsUser;
    return {
      success: true,
      data: safeUser,
    };
  }
  async getUserPhone(phone: string) {
    const existsPhone = await this.prisma.user.findUnique({
      where: { phone: phone },
    });
    if (!existsPhone) throw new NotFoundException("user's phone not found!");

    const { password, ...user } = existsPhone;
    return {
      success: true,
      data: user,
    };
  }
  async createAdmin(payload: CreateUserDto) {
    const existAdmin = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (existAdmin) {
      throw new ConflictException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const result = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        password: hashedPassword,
        phone: payload.phone,
        role: UserRole.ADMIN,
      },
    });

    const { password, ...admin } = result;
    return {
      success: true,
      data: admin,
    };
  }

  async createMentor(payload: CreateMentorDto, file: string) {
    const existMentor = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (existMentor) {
      throw new ConflictException('Mentor already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const adminCreate = await this.prisma.user.create({
      data: {
        fullName: payload.fullName,
        password: hashedPassword,
        phone: payload.phone,
        role: UserRole.MENTOR,
        image: file
      },
    });
    const createProfile = await this.prisma.mentorProfile.create({
      data: {
        about: payload.about,
        experience: payload.experience,
        facebook: payload.facebook
          ? `https://facebook.com/${payload.facebook}`
          : null,
        github: payload.github ? `https://github.com/${payload.github}` : null,
        instagram: payload.instagram
          ? `https://instagram.com/${payload.instagram}`
          : null,
        job: payload.job,
        linkedin: payload.linkedin
          ? `https://linkedin.com/in/${payload.linkedin}`
          : null,
        telegram: payload.telegram ? `https://t.me/${payload.telegram}` : null,
        userId: adminCreate.id,
        website: payload.website,
      },
    });

    return {
      success: true,
      data: {
        adminCreate,
        createProfile,
      },
    };
  }

  async createAsisant(payload: CreateAsisant) {
    const existMentor = await this.prisma.user.findUnique({
      where: { phone: payload.phone },
    });
    if (existMentor) {
      throw new ConflictException('Asisant already exists');
    }
    const existsPhone = await this.prisma.user.findUnique({ where: { phone: payload.phone } })
    if (existsPhone) throw new ConflictException('phone already exists!')

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.prisma.user.create({
      data: {
        phone: payload.phone,
        fullName: payload.fullName,
        password: hashedPassword,
        role: UserRole.ASSISTANT,
      },
    });

    await this.prisma.assignedCourse.create({
      data: {
        userId: user.id,
        courseId: payload.courseId,
      },
    });

    return {
      success: true,
      data: user,
    };
  }

  async updateMentorProfile(id: number, payload: UpdateMentorDto) {
    const existsUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existsUser) throw new NotFoundException('User not found');

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: payload.fullName,
        phone: payload.phone,
      },
    });

    const mentorProfile = await this.prisma.mentorProfile.findUnique({
      where: { userId: id },
    });

    if (!mentorProfile) {
      throw new NotFoundException('Mentor profile not found');
    }

    const result = await this.prisma.mentorProfile.update({
      where: { userId: id },
      data: {
        about: payload.about,
        experience: payload.experience,
        facebook: payload.facebook,
        github: payload.github,
        instagram: payload.instagram,
        linkedin: payload.linkedin,
        telegram: payload.telegram,
        job: payload.job,
        website: payload.website,
      },
    });
    const { password, ...safeUser } = updatedUser;
    return {
      success: true,
      data: result,
      safeUser,
    };
  }

  async deleteUserById(id: number) {
    const existsUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existsUser) throw new NotFoundException('User not found');

    await this.prisma.$transaction(async (tx) => {
      if (existsUser.role === UserRole.MENTOR) {
        const mentorProfile = await tx.mentorProfile.findUnique({
          where: { userId: id },
        });
        if (mentorProfile) {
          await tx.mentorProfile.delete({ where: { userId: id } });
        }
      }

      await tx.lessonView.deleteMany({ where: { userId: id } });

      await tx.user.delete({ where: { id } });
    });

    return {
      success: true,
      message: 'Successfully deleted!',
    };
  }
}
