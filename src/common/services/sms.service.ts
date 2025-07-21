import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { SMSSendResponse } from '../utils/helper/helper';

@Injectable()
export class SmsService {
  private readonly TOKEN = process.env.SMS_TOKEN;
  private readonly FROM = process.env.SMS_FROM;
  private readonly URL = process.env.SMS_URL;
  private readonly USERNAME = process.env.SMS_LOGIN;
  private readonly CALLBACK_URL = process.env.SMS_CALLBACK_URL;

  private axiosInstance = axios.create({
    baseURL: this.URL,
  });

  public async sendSMS(message: string, to: string) {
    try {
      const { data } = await this.axiosInstance.post<{
        data: { token: string };
      }>('/auth/login', {
        email: this.USERNAME,
        password: this.TOKEN,
      });

      await this.axiosInstance.post<SMSSendResponse>(
        '/message/sms/send',
        {
          from: this.FROM,
          message,
          mobile_phone: to.replace(/\s+/g, ''),
          callback_url: this.CALLBACK_URL,
        },
        {
          headers: {
            Authorization: 'Bearer ' + data.data.token,
          },
        },
      );
    } catch (error: any) {
      throw new HttpException(
        'SMS Service: ' + (error?.response?.statusText || error.message),
        400,
      );
    }
  }
}
