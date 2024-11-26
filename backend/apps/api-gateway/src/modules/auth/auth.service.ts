import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository, In } from 'typeorm';

import { RoleEntity } from './entities/RoleEntity';
import { UserEntity } from './entities/UserEntity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly configService: ConfigService,
  ) {}

  async initUser(
    id: string,
    role: 'customer' | 'partner',
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<UserEntity> {
    const roleIds = [this.configService.get<string>('KEYCLOAK_DEFAULT_REALM_ROLE_ID')] as string[];

    if (role === 'partner') {
      roleIds.push(this.configService.get<string>('KEYCLOAK_PARTNER_ROLE_ID') as string);
    } else {
      roleIds.push(this.configService.get<string>('KEYCLOAK_CUSTOMER_ROLE_ID') as string);
    }

    function addPrefixToEmail(email, prefix) {
      const atIndex = email.indexOf('@');
      if (atIndex === -1) {
        return null;
      }
      return email.slice(0, atIndex) + prefix + email.slice(atIndex);
    }

    const [user, existingUserByEmail, roles] = await Promise.all([
      this.userRepository.findOne({
        where: { id, realmId: this.configService.get<string>('KEYCLOAK_REALM_ID') },
      }),
      this.userRepository.findOne({
        where: { email, realmId: this.configService.get<string>('KEYCLOAK_REALM_ID') },
      }),
      this.roleRepository.find({
        where: { id: In(roleIds) },
      }),
    ]);

    if (!user) {
      let temporaryEmail = email;

      if (existingUserByEmail) {
        temporaryEmail = addPrefixToEmail(email, `+${moment().valueOf()}`);
      }

      const savedUser = this.userRepository.create({
        id,
        email: temporaryEmail,
        emailConstraint: temporaryEmail,
        enabled: true,
        firstName,
        lastName,
        roles,
        isPartner: role === 'partner' || false,
        originSupabaseEmail: email,
        realmId: this.configService.get<string>('KEYCLOAK_REALM_ID'),
        createdTimestamp: moment().valueOf() * 1000,
      });
      await this.userRepository.save(savedUser);

      return savedUser;
    }

    return user;
  }
}
