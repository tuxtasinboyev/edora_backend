import { Body, Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';

@Controller('verification')
export class VerificationController {
    constructor(private verificationService: VerificationService) { }

    @Post()
    sendOtp(@Body() payload: SendOtpDto) {
        return this.verificationService.sendOtp(payload)
    }
    @Post('verify')
    verifyOtp(@Body() payload: VerifyOtpDto) {
        return this.verificationService.verifyOtp(payload)
    }
}
