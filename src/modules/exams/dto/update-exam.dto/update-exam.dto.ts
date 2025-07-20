import { PartialType } from "@nestjs/swagger";
import { CreateExamDto, PassExamDto } from "../create-exam.dto/create-exam.dto";

export class UpdateExamDto extends PartialType(CreateExamDto){}
