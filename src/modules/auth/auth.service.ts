import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto/register-auth.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';
import { VerificationService } from 'src/modules/verification/verification.service';
import { EVeriification } from 'src/common/utils/helper/helper';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private verificationSe: VerificationService
    ) { }

    async register(payload: RegisterAuthDto) {
        await this.verificationSe.checkConfirim({
            type: EVeriification.REGISTER,
            phone: payload.phone,
            otp: payload.otp
        })
        const { phone, password } = payload;

        const existingUser = await this.prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashPassword = await hash(password, 10);
        payload.password = hashPassword;

        const user = await this.prisma.user.create({
            data: {
                phone: payload.phone,
                password: payload.password,
                fullName: payload.fullName,
            },
        });

        const tokens = await this.generateTokens(user.id, user.role);


        return {
            user: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
            },
            tokens,
        };
    }

    async generateTokens(userId: number, role: string) {
        const payload = { sub: userId, role };

        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
        });

        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
        });

        return { access_token, refresh_token };
    }

    async login(payload: LoginAuthDto) {
        const { phone, password } = payload;

        const user = await this.prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        const tokens = await this.generateTokens(user.id, user.role);
        return {
            user: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
            },
            tokens,
        };
    }
}
