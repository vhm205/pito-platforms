import { CUSTOMER_DB_SOURCE, PARTNER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerRepository } from '../customer.repository';
import { OperatorRepository } from '../operator.repository';
import { PartnerUserRelationshipRepository } from '../partner-user-relationship.repository';
import { PartnerRepository } from '../partner.repository';
import { StoreUserRelationshipRepository } from '../store-user-relationship.repository';
import { UserPartnerRepository } from '../user-partner.repository';

import { CompanyEntity } from './entities/company.entity';
import { CustomerEntity } from './entities/customer.entity';
import { OperatorEntity } from './entities/operator.entity';
import { PartnerUserRelationship } from './entities/partner-user-relationship.entity';
import { PartnerEntity } from './entities/partner.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RoleEntity } from './entities/role.entity';
import { StoreUserRelationship } from './entities/store-user-relationship.entity';
import { UserCustomerEntity } from './entities/user-customer.entity';
import { UserPartnerEntity } from './entities/user-partner.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { CustomerRelationalRepository } from './repositories/customer.repository';
import { OperatorRelationalRepository } from './repositories/operator.repository';
import { PartnerUserRelationshipRelationRepository } from './repositories/partner-user-relationship.repository';
import { PartnerRelationalRepository } from './repositories/partner.repository';
import { StoreUserRelationshipRelationRepository } from './repositories/store-user-relationship.repository';
import { UserPartnerRelationalRepository } from './repositories/user-partner.repository';

const customerEntities = [UserCustomerEntity, CustomerEntity, OperatorEntity, CompanyEntity];

const partnerEntities = [
  UserPartnerEntity,
  PartnerEntity,
  UserRoleEntity,
  RoleEntity,
  RolePermissionEntity,
  PermissionEntity,
  PartnerUserRelationship,
  StoreUserRelationship,
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
    {
      provide: PartnerUserRelationshipRepository,
      useClass: PartnerUserRelationshipRelationRepository,
    },
    {
      provide: StoreUserRelationshipRepository,
      useClass: StoreUserRelationshipRelationRepository,
    },
  ],
  exports: [
    CustomerRepository,
    PartnerRepository,
    OperatorRepository,
    UserPartnerRepository,
    PartnerUserRelationshipRepository,
    StoreUserRelationshipRepository,
  ],
})
export class RelationalUserPersistenceModule {}
