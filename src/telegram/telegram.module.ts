import { Module } from '@nestjs/common';;
import { HttpModule } from '@nestjs/axios'; 
import { ContactService } from './telegram.service';
import { ContactController } from './telegram.controller';

@Module({
    imports: [HttpModule],  
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule { }
