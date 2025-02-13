import { ReadableOrderType } from '@app/common/enums';

export function generateTxCode(type: ReadableOrderType) {
  const prefix: string = type;

  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = 12;
  let txCode = prefix;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    txCode += characters.charAt(randomIndex);
  }

  return txCode;
}
