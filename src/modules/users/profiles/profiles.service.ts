import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NatMap } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { compare, hash, hashSync } from 'bcrypt';
import { UpdateLastActivtyDto } from './dto/lastActivty-dto/update-lastActivtiy';
import { UpdatePasswordDto } from './dto/resent-password';
import { UpdateMentorProfileDto } from './dto/update-mentorProfie.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { VerificationService } from '../../auth/verification/verification.service';
import { EVeriification, generateOtp } from 'src/common/utils/helper/helper';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class ProfilesService {
  constructor(
    private prisma: PrismaService,
    private verificationService: VerificationService,
  ) { }
  async phoneUpdate(payload: UpdatePhoneDto, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User found');
    }
    const checkPhone = await this.prisma.user.findUnique({
      where: { phone: payload.oldPhone },
    });
    console.log(checkPhone);

    if (!checkPhone) return new NotFoundException('phone not exists!');
    if (checkPhone!.phone === payload.newPhone) return new ConflictException('this this phone already exists!')
    await this.verificationService.sendOtp({ type: EVeriification.EDIT_PHONE, phone: payload.newPhone });

    return {
      success: true,
      message: 'successfully updated!',
    };
  }

  async confirmPhoneUpdate(otp: string, phone: string, userId: number) {


      const existsUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });


      if (!existsUser) throw new NotFoundException('user not found');

      const isValid = await this.verificationService.verifyOtp({
        type: EVeriification.EDIT_PHONE,
        phone: phone,
        otp,
      });
      if (!isValid) throw new BadRequestException('Invalid OTP');

      await this.prisma.user.update({
        where: { id: userId },
        data: { phone: phone },
      });
    return {
      success: true,
        message: 'Phone number updated successfully',
      };
  }

  async getMyProfile(userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existsUser) {
      throw new NotFoundException('User not found');
    }

    if (existsUser.role === UserRole.MENTOR) {
      const mentorProfile = await this.prisma.mentorProfile.findUnique({
        where: { userId: existsUser.id },
        include: { user: true },
      });

      if (!mentorProfile) {
        throw new NotFoundException('Mentor profile not found');
      }
      const { password, ...cleanUser } = mentorProfile.user;

      const cleanMentorProfile = {
        ...mentorProfile,
        user: cleanUser
      };

      return {
        success: true,
        data: {
          mentorProfile: cleanMentorProfile
        }
      };


    }


  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
    filename?: string,
  ) {
    const existsUser = await this.prisma.user.findUnique({ where: { id: id } });
    if (!existsUser) throw new NotFoundException('user not found');

    if (existsUser.image) {
      const oldPath = join(process.cwd(), 'uploads', 'image', existsUser.image.split('/').pop()!);

      if (existsSync(oldPath)) {
        unlinkSync(oldPath)
      }
    }
    let imageUrl: string | undefined = existsUser.image || undefined;
    const updateMyProfile = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: updateProfileDto.fullName,
        image: filename,
      },
    });
    const { password, ...user } = updateMyProfile;
    return {
      success: true,
      data: user,
    };
  }
  async getLastActivty(userId: number) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existsUser) throw new NotFoundException('user not found');

    const result = await this.prisma.lastActivity.findUnique({
      where: { userId },
      select: {
        id: true,
        url: true,
        userId: true,
        groupId: true,
        group: { select: { id: true, name: true } },
      },
    });
    if (!result) throw new NotFoundException('not found lastActivity');
    return {
      success: true,
      data: result,
    };
  }
  async updateLastActivty(payload: UpdateLastActivtyDto, userId: number) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existsUser) throw new NotFoundException('user not found');
    const result = await this.prisma.lastActivity.update({
      where: { userId },
      data: payload,
    });
    return {
      success: true,
      data: result,
    };
  }
  async resetPassword(payload: UpdatePasswordDto, userId: number) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existsUser) throw new NotFoundException('user not found');

    const isPassword = await compare(payload.password, existsUser.password);
    if (!isPassword)
      throw new NotFoundException('password or phone invalid!!!');

    const hashPassword = await hash(payload.newPassword, 10);

    const updatePassword = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashPassword,
      },
    });

    return {
      success: true,
      message: 'successfully updated',
    };
  }
  async updateMentorProfile(payload: UpdateMentorProfileDto, userId: number) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existsUser) throw new NotFoundException('user not found');

    const updateProfile = await this.prisma.mentorProfile.update({
      where: { userId },
      data: payload,
    });
    return {
      success: true,
      data: updateProfile,
    };
  }
}
