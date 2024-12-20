import { NOTIFICATION_SERVICE } from '@app/common';
import {
  NOTIFICATION_SERVICE_NAME,
  NotificationServiceClient,
} from '@app/common/types/proto/notification';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class NotificationsService {
  private notificationsServiceClient: NotificationServiceClient;

  constructor(@Inject(NOTIFICATION_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.notificationsServiceClient =
      this.client.getService<NotificationServiceClient>(NOTIFICATION_SERVICE_NAME);
  }

  getTotalNotifications(userId: string) {
    const source$ = this.notificationsServiceClient
      .getTotalNotification({ userId })
      .pipe(timeout(3000));
    return firstValueFrom(source$);
  }
}
