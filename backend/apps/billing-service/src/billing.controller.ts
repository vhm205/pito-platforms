import {
  BillingServiceController,
  BillingServiceControllerMethods,
  EmailSentDto,
} from '@app/common';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';

@Controller()
@BillingServiceControllerMethods()
export class BillingController implements BillingServiceController {
  constructor(@Inject('NOTIFICATIONS_SERVICE') private rabbitClient: ClientProxy) {}

  async createPayment(): Promise<{ status: boolean }> {
    const message = {
      from: 'tech@pito.vn',
      to: 'tuan.nguyen@pito.vn',
      subject: 'This is test subject',
      body: 'This is test body',
    } as EmailSentDto;

    const record = new RmqRecordBuilder(message)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 0,
        persistent: true,
        deliveryMode: 0,
      })
      .build();

    this.rabbitClient.emit('email-sent', record);

    // await lastValueFrom(this.rabbitClient.emit('email-sent', record));

    return Promise.resolve({ status: true });
  }
}
