import {} from '@app/common';

export class Transaction {
  id: string;
  orderId: string;
  amount: number;
  billCode: string;
  transactionCode: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  createdAt: Date;

  toMessage() {
    return {
      id: this.id,
      orderId: this.orderId,
      amount: this.amount,
      billCode: this.billCode,
      transactionCode: this.transactionCode,
      bankAccountName: this.bankAccountName,
      bankAccountNumber: this.bankAccountNumber,
      createdAt: this.createdAt,
    };
  }
}
