import { PartialType } from '@nestjs/swagger';
import { PurchaseCourseDto } from './create-purchased.dto';

export class UpdatePurchasedDto extends PartialType(PurchaseCourseDto) {}
