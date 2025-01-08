import { getImageUrl } from '@app/common';
import { Customer } from 'apps/user-service/src/domain/customer.domain';

import { CustomerEntity } from '../entities/customer.entity';

export class CustomerMapper {
  static toDomain(raw: CustomerEntity): Customer {
    const domain = new Customer();

    domain.id = raw.id;
    domain.email = raw.email;
    domain.phone = raw.phone;
    domain.firstName = raw.firstName;
    domain.lastName = raw.lastName;
    domain.avatar = raw.avatar ? getImageUrl(raw.avatar) : null;
    domain.thumbnail = raw.thumbnail ? getImageUrl(raw.thumbnail) : null;
    domain.contactAddress = raw.contactAddress ? raw.contactAddress.label : null;

    if (raw.deliveryAddresses) {
      domain.deliveryAddresses = raw.deliveryAddresses.map(
        ({ name, label, type, default: isDefault }) => ({
          name,
          label,
          type,
          default: isDefault,
        }),
      );
    } else {
      domain.deliveryAddresses = [];
    }

    return domain;
  }
}
