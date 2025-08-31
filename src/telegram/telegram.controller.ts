import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './telegram.service';
import { CreateContactDto } from './dto/create-contact-dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('api/contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    @ApiOperation({ summary: 'Send message to Telegram' })
    @ApiResponse({ status: 201, description: 'Message sent successfully' })
    async sendMessage(@Body() body: CreateContactDto) {
        await this.contactService.sendToTelegram(body);
        return { message: 'Xabaringiz yuborildi ✅' };
    }
}
