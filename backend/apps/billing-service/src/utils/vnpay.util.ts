import * as crypto from 'node:crypto';

import { HandleIpnVnpayRequest } from '@app/common/types/proto/payment/vnpay';

export function sortObject<T extends Record<string, any>>(obj: T): T {
  return Object.keys(obj)
    .sort()
    .reduce((acc: Record<string, unknown>, key) => {
      acc[key] = obj[key];
      return acc;
    }, {}) as T;
}

export function hashSha512(data: string, secret: string): string {
  const secureHash = crypto.createHmac('sha512', secret).update(data).digest('hex');
  return secureHash;
}

export function checkVnpayResponseValid(
  vnpayQuery: HandleIpnVnpayRequest,
  secret: string,
): boolean {
  const queriesFormated = {
    vnp_Amount: vnpayQuery.vnpAmount,
    vnp_BankCode: vnpayQuery.vnpBankCode,
    vnp_CardType: vnpayQuery.vnpCardType,
    vnp_OrderInfo: vnpayQuery.vnpOrderInfo,
    vnp_PayDate: vnpayQuery.vnpPayDate,
    vnp_ResponseCode: vnpayQuery.vnpResponseCode,
    vnp_TmnCode: vnpayQuery.vnpTmnCode,
    vnp_TransactionNo: vnpayQuery.vnpTransactionNo,
    vnp_TxnRef: vnpayQuery.vnpTxnRef,
    vnp_TransactionStatus: vnpayQuery.vnpTransactionStatus,
  };

  const queriesSorted = sortObject(queriesFormated);

  // Create secure hash
  const searchParams = new URLSearchParams(queriesSorted as any);
  const signData = searchParams.toString();
  const _vnpSecureHash = hashSha512(signData, secret);

  // Check secure hash
  return _vnpSecureHash === vnpayQuery.vnpSecureHash;
}
