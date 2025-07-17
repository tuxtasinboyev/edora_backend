import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterAuthDto) {
        return this.authService.register(dto);
    }
    @Post('login')
    async login(@Body() dto: LoginAuthDto) {
        return this.authService.login(dto);
    }

}
