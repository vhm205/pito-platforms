export const VnpayResponseCodes: Record<string, Record<string, string>> = Object.freeze({
  success: {
    code: '00',
    message: 'Confirm Success',
  },
  not_found: {
    code: '01',
    message: 'Order not found',
  },
  already_confirmed: {
    code: '02',
    message: 'Order already confirmed',
  },
  invalid_amount: {
    code: '04',
    message: 'Invalid amount',
  },
  invalid_checksum: {
    code: '97',
    message: 'Invalid Checksum',
  },
  unknown_error: {
    code: '99',
    message: 'Unknown error',
  },
});

export const vnpayResponse = Object.freeze({
  success: {
    RspCode: VnpayResponseCodes.success.code,
    Message: VnpayResponseCodes.success.message,
  },
  orderNotFound: {
    RspCode: VnpayResponseCodes.not_found.code,
    Message: VnpayResponseCodes.not_found.message,
  },
  orderAlreadyConfirmed: {
    RspCode: VnpayResponseCodes.already_confirmed.code,
    Message: VnpayResponseCodes.already_confirmed.message,
  },
  invalidAmount: {
    RspCode: VnpayResponseCodes.invalid_amount.code,
    Message: VnpayResponseCodes.invalid_amount.message,
  },
  checksumError: {
    RspCode: VnpayResponseCodes.invalid_checksum.code,
    Message: VnpayResponseCodes.invalid_checksum.message,
  },
  unknownError: {
    RspCode: VnpayResponseCodes.unknown_error.code,
    Message: VnpayResponseCodes.unknown_error.message,
  },
});

export const VnpayResponseCodesDescription: Record<string, string> = Object.freeze({
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
  '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  '13': 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
  '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
  '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
  '75': 'Ngân hàng thanh toán đang bảo trì.',
  '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
  '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
});
