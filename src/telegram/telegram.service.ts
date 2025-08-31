import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
    constructor(private readonly httpService: HttpService) { }

    async sendToTelegram(data: { fullName: string; phone: string; message: string }) {
        const token = process.env.TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID ;

        const text = `
🆕 Yangi xabar!
👤 Ismi: ${data.fullName}
📞 Telefon: ${data.phone}
✉️ Xabar: ${data.message}
    `;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        await this.httpService.axiosRef.post(url, {
            chat_id: chatId,
            text: text,
        });
    }
}
