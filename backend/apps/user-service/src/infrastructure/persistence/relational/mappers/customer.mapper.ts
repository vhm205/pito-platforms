import { getImageUrl } from '@app/common';
import { Customer } from 'apps/user-service/src/domain/customer.domain';

import { CustomerEntity } from '../entities/customer.entity';

export class CustomerMapper {
  static toDomain(raw: CustomerEntity): Customer {
    const domain = new Customer();

    domain.id = raw.id;
    domain.email = raw.email;
    domain.phone = raw.phone;
    domain.firstName = raw.firstName ?? raw.name;
    domain.lastName = raw.lastName;
    domain.avatar = raw.avatar ? getImageUrl(raw.avatar) : null;
    domain.thumbnail = raw.thumbnail ? getImageUrl(raw.thumbnail) : null;
    domain.contactAddress = raw.contactAddress ? raw.contactAddress.label : null;
    domain.companyId = raw.companyId ?? undefined;
    domain.createdAt = raw.createdAt;
    domain.status = raw.status;
    if (raw.updatedAt) domain.updatedAt = raw.updatedAt;

    if (raw.deliveryAddresses) {
      domain.deliveryAddresses = raw.deliveryAddresses.map(
        ({
          id,
          name,
          label,
          type,
          default: isDefault,
          companyName,
          building,
          numberOfApartment,
          createdAt,
          geometry,
        }) => ({
          id,
          name,
          label,
          type,
          default: isDefault,
          companyName,
          building,
          numberOfApartment,
          createdAt,
          geometry: geometry && {
            point: geometry.point,
          },
        }),
      );
    } else {
      domain.deliveryAddresses = [];
    }

    return domain;
  }
}
