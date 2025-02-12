export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 3000; // 3 seconds delay between retries

export function calculateBackoff(retryCount: number, baseDelay = 1000, factor = 2): number {
  return baseDelay * Math.pow(factor, retryCount);
}

export function getOrderNotificationTemplate(code: string, orderCode = '') {
  const DELIVERY_LATER_APPROVE_TIME = Number(process.env.DELIVERY_LATER_APPROVE_TIME ?? 3600);
  const DELIVERY_NOW_APPROVE_TIME = Number(process.env.DELIVERY_NOW_APPROVE_TIME ?? 1800);

  const deliveryLaterApproveTimeInMinutes = DELIVERY_LATER_APPROVE_TIME / 60;
  const deliveryNowApproveTimeInMinutes = DELIVERY_NOW_APPROVE_TIME / 60;

  const notifications: { [key: string]: { title: string; body: string } } = {
    'IN-01': {
      title: 'Bạn có đơn hàng mới',
      body: `Xác nhận đơn trong ${deliveryNowApproveTimeInMinutes} phút.`,
    },
    'IN-02': {
      title: 'Bạn có đơn hàng đặt trước',
      body: `Xác nhận đơn trong ${deliveryLaterApproveTimeInMinutes} phút.`,
    },
    'IN-03': {
      title: 'Rất tiếc! Đơn hàng bị huỷ',
      body: `Đơn hàng #${orderCode} vừa bị huỷ`,
    },
    'IN-04': {
      title: 'Bỏ lỡ đơn hàng',
      body: `Đơn #${orderCode} không được xác nhận`,
    },
    'IN-05': {
      title: 'Xác nhận làm xong',
      body: `Đơn #${orderCode} đã làm xong?`,
    },
    'IN-06': {
      title: 'Xác nhận đã giao',
      body: `Đơn #${orderCode} đã được giao?`,
    },
    'IN-07': {
      title: 'Bạn có đơn hàng chưa được xác nhận',
      body: `Chỉ còn 5 phút để xác nhận đơn #${orderCode}`,
    },
  };

  return notifications[code] || { title: '', body: '' };
}
