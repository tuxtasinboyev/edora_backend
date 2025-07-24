import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CheckoutDto, } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('checkout')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Create payment checkout link for course (STUDENT)' })
  @ApiResponse({ status: 201, description: 'Checkout created successfully' })
  @ApiResponse({ status: 404, description: 'User or course not found' })
  checkout(@Req() req, @Body() dto: CheckoutDto) {
    const userId = req.user.id;
    return this.paymentsService.createCheckout(userId, dto);
  }

}
