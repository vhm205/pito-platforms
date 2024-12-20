import { NotificationStatus, NotificationType } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export class Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  sendAt: Date;
  readAt: NullableType<Date>;
  createdAt: Date;
  metadata: NullableType<Record<string, unknown>>;
}
