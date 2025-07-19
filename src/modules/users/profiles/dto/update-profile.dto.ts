import { PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto/create-user.dto';

export class UpdateProfileDto extends PartialType(CreateUserDto) { }
