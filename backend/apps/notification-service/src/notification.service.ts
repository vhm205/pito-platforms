import { EmailSentDto } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async sendEmail(emailSentDto: EmailSentDto): Promise<{ status: boolean }> {
    // eslint-disable-next-line no-console
    console.log('emailSentDto', emailSentDto);
    return Promise.resolve({ status: true });
  }
}
