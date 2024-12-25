import {} from '@app/common';

export class Transaction {
  id: string;
  orderId: string;
  amount: number;
  billCode: string;
  transactionCode: string;
  bankName: string;
  bankAccountNumber: string;
  createdAt: Date;

  toMessage() {
    return {
      id: this.id,
      orderId: this.orderId,
      amount: this.amount,
      billCode: this.billCode,
      transactionCode: this.transactionCode,
      bankName: this.bankName,
      bankAccountNumber: this.bankAccountNumber,
      createdAt: this.createdAt,
    };
  }
}
