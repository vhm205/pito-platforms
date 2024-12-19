// import { OrderStatus } from '@app/common/types/proto/common';

import { OrderNoteDto } from './common.dto';

export class UpdateOrderDto {
  id: string;
  // status_code: OrderStatus;

  operationNotes: OrderNoteDto[];
}
