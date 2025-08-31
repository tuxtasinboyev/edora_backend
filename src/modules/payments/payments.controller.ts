import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CheckoutDto } from './dto/create-payment.dto';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Request, Response } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Create checkout link for Payme (Only STUDENT)' })
  @ApiResponse({ status: 201, description: 'Checkout link created successfully' })
  @ApiResponse({ status: 400, description: 'User already purchased this course' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async createCheckout(
    @Req() req,
    @Body() dto: CheckoutDto,
  ) {
    const user = req.user;
    return this.paymentsService.createPayment(dto, user);
  }

  @Post('payme')
  @ApiOperation({ summary: 'Handle Payme Gateway POST request (Webhook)' })
  @ApiResponse({ status: 200, description: 'Payme gateway request handled' })
  @ApiResponse({ status: 403, description: 'Authentication failed from Payme' })
  async paymeWebhook(
    @Req() req,
    @Res() res,
    @Body() payload: any,
  ) {
    const result = await this.paymentsService.handlePaymeRequest(payload, req, res);
    return res.status(HttpStatus.OK).json(result);
  }
}
