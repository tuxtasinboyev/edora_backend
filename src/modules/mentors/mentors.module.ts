import { Module } from '@nestjs/common';
import { MentorsService } from './mentors.service';

@Module({
  providers: [MentorsService]
})
export class MentorsModule {}
