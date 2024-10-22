import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  constructor() {
    super();
  }

  authenticate(): void {
    // @ts-expect-error: FIX when public API
    this.success({ [Symbol.for('isPublic')]: true });
  }
}
