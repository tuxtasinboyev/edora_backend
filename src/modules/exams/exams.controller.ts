import { Controller } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
    constructor(private examService: ExamsService) { }
}
