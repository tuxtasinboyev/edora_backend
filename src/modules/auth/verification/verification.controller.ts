import { Body, Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { SendOtpDto, VerifyOtpDto } from './dto/verification.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Post()
  @ApiOperation({ summary: 'Send OTP to phone' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  sendOtp(@Body() payload: SendOtpDto) {
    return this.verificationService.sendOtp(payload);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify received OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  verifyOtp(@Body() payload: VerifyOtpDto) {
    return this.verificationService.verifyOtp(payload);
  }
}
