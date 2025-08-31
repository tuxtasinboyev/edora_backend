import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import {
  EVeriification,
  generateOtp,
  ICheckOtp,
} from 'src/common/utils/helper/helper';
import { RedisService } from 'src/config/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmsService } from 'src/common/services/sms.service';

@Injectable()
export class VerificationService {
  constructor(
    private redisService: RedisService,
    private prisma: PrismaService,
    private smsService: SmsService,
  ) { }
  public getKey(type: EVeriification, phone: string, confirmatioin?: boolean) {
    const storeKeys: Record<EVeriification, string> = {
      [EVeriification.REGISTER]: 'reg_',
      [EVeriification.RESET_PASSWORD]: 'respass_',
      [EVeriification.EDIT_PHONE]: 'edph_',
    };

    let key = storeKeys[type];
    if (confirmatioin) {
      key += 'cfm_';
    }
    key += phone;
    return key;
  }
  private async throwIfUserExists(phone: string) {
    const existsUser = await this.prisma.user.findUnique({ where: { phone } });
    if (existsUser) throw new ConflictException('this phone already used');
    return existsUser;
  }
  private async throwIfUserNotExists(phone: string) {
    const existsUser = await this.prisma.user.findUnique({ where: { phone } });
    if (!existsUser) throw new NotFoundException('User not found');
    return existsUser;
  }
  private getMessage(type: EVeriification, otp: string) {
    switch (type) {
      case EVeriification.REGISTER:
        return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
      case EVeriification.RESET_PASSWORD:
        return `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
      case EVeriification.EDIT_PHONE:
        return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
    }

  }
  async verifyOtp(payload: VerifyOtpDto) {
    const { type, phone, otp } = payload;

    const session = await this.redisService.get(this.getKey(type, phone));
    if (!session) throw new BadRequestException('OTP expired');

    console.log('body OTP:', otp, typeof otp);
    console.log('Redis session:', session, typeof session);

    if (String(otp) !== String(session)) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.redisService.delete(this.getKey(type, phone));

    await this.redisService.set(
      this.getKey(type, phone, true),
      otp,
      60 * 60,
    );

    return {
      success: true,
      message: 'Verified',
    };
  }


  public async checkConfirim(payload: ICheckOtp) {
    const { type, phone, otp } = payload;

    const key = this.getKey(type, phone, true);
    console.log(key, "checkConfirm key");

    const session = await this.redisService.get(key);
    console.log(session, "session from redis");

    if (!session) throw new BadRequestException('Session expired');

    if (otp !== session) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.redisService.delete(key);
    return true;
  }

  async sendOtp(payload: SendOtpDto) {
    const { type, phone } = payload;
    const key = this.getKey(type, phone);
    console.log(key, 'sendOtp key');

    const session = await this.redisService.get(key);
    // if (session) {
    //   throw new BadRequestException('Code already sent to user');
    // }

    switch (type) {
      case EVeriification.REGISTER:
        await this.throwIfUserExists(phone);
        break;
      case EVeriification.EDIT_PHONE:
      case EVeriification.RESET_PASSWORD:
        await this.throwIfUserNotExists(phone);
        break;
    }

    const otp = generateOtp();
    await this.redisService.set(key, otp, 60 * 60);

    await this.smsService.sendSMS(this.getMessage(type, otp)!, phone);

    return { message: 'Confirm code sent to user' };
  }

}
