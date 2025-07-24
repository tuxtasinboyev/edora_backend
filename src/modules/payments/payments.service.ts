import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CheckoutDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) { }

  async createCheckout(userId: number, dto: CheckoutDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    const existingPurchase = await this.prisma.purchasedCourse.findFirst({
      where: { userId, courseId: dto.courseId },
    });
    if (existingPurchase) {
      throw new ConflictException('You have already purchased this course');
    }

    const fakeCheckoutUrl = `https://fakepay.com/checkout?course=${dto.courseId}&user=${userId}`;

    return {
      success: true,
      message: 'Checkout link created',
      data: {
        checkoutUrl: fakeCheckoutUrl,
      },
    };
  }
}
