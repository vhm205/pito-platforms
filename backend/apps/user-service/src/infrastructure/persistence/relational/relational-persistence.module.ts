import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerRepository } from '../customer.repository';
import { OperatorRepository } from '../operator.repository';
import { PartnerRepository } from '../partner.repository';
import { UserPartnerRepository } from '../user-partner.repository';

import { CompanyEntity } from './entities/company.entity';
import { CustomerEntity } from './entities/customer.entity';
import { OperatorEntity } from './entities/operator.entity';
import { PartnerEntity } from './entities/partner.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RoleEntity } from './entities/role.entity';
import { UserCustomerEntity } from './entities/user-customer.entity';
import { UserPartnerEntity } from './entities/user-partner.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { CustomerRelationalRepository } from './repositories/customer.repository';
import { OperatorRelationalRepository } from './repositories/operator.repository';
import { PartnerRelationalRepository } from './repositories/partner.repository';
import { UserPartnerRelationalRepository } from './repositories/user-partner.repository';

const customerEntities = [UserCustomerEntity, CustomerEntity, OperatorEntity, CompanyEntity];

const partnerEntities = [
  UserPartnerEntity,
  PartnerEntity,
  UserRoleEntity,
  RoleEntity,
  RolePermissionEntity,
  PermissionEntity,
];

@Module({
  imports: [
    TypeOrmModule.forFeature(customerEntities, CUSTOMER_DB_SOURCE),
    TypeOrmModule.forFeature(partnerEntities, PARTNER_DB_SOURCE),
  ],
  providers: [
    {
      provide: CustomerRepository,
      useClass: CustomerRelationalRepository,
    },
    {
      provide: PartnerRepository,
      useClass: PartnerRelationalRepository,
    },
    {
      provide: OperatorRepository,
      useClass: OperatorRelationalRepository,
    },
    {
      provide: UserPartnerRepository,
      useClass: UserPartnerRelationalRepository,
    },
  ],
  exports: [CustomerRepository, PartnerRepository, OperatorRepository, UserPartnerRepository],
})
export class RelationalUserPersistenceModule {}
