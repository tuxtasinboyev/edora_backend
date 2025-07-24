import { PartialType } from '@nestjs/swagger';
import { CheckoutDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CheckoutDto) {}
