import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorDto } from './create-mento.dto';

export class UpdateMentorDto extends PartialType(CreateMentorDto) { }
