import {
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  USER_SERVICE,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { CacheExpiry } from '@app/common/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisStore } from 'cache-manager-redis-yet';
import * as moment from 'moment';
import { firstValueFrom, timeout } from 'rxjs';
import { In, Repository } from 'typeorm';

import { RoleEntity } from './entities/RoleEntity';
import { UserEntity } from './entities/UserEntity';

@Injectable()
export class AuthService {
  private userServiceClient: UsersServiceClient;
  private partnerServiceClient: MenusServiceClient;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @Inject(USER_SERVICE) private readonly userClient: ClientGrpc,
    @Inject(MENU_SERVICE) private readonly partnerClient: ClientGrpc,
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisStore,
  ) {
    this.userServiceClient = this.userClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
    this.partnerServiceClient =
      this.partnerClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async getCustomerProfileByUserId(id: string) {
    const cacheKey = `profile:customer:${id}`;
    const cachedProfile = await this.cacheManager.get(cacheKey);

    if (cachedProfile) return cachedProfile;

    const source$ = this.userServiceClient.getCustomerProfile({ userId: id }).pipe(timeout(3000));
    const customerProfile = await firstValueFrom(source$);

    await this.cacheManager.set(cacheKey, customerProfile, CacheExpiry.Minutes * 5);

    return customerProfile;
  }

  async getPartnerProfileByUserId(id: string) {
    const cacheKey = `profile:partner:${id}`;
    const cachedProfile = await this.cacheManager.get(cacheKey);

    if (cachedProfile) return cachedProfile;

    const source$ = this.userServiceClient.getPartnerProfile({ userId: id }).pipe(timeout(3000));
    const partnerProfile = await firstValueFrom(source$);

    await this.cacheManager.set(cacheKey, partnerProfile, CacheExpiry.Minutes * 5);

    return partnerProfile;
  }

  async getOperatorProfileByUserId(id: string) {
    const cacheKey = `profile:operator:${id}`;
    const cachedProfile = await this.cacheManager.get(cacheKey);

    if (cachedProfile) return cachedProfile;

    const source$ = this.userServiceClient.getOperatorProfile({ userId: id }).pipe(timeout(3000));
    const operatorProfile = await firstValueFrom(source$);

    await this.cacheManager.set(cacheKey, operatorProfile, CacheExpiry.Minutes * 5);

    return operatorProfile;
  }

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
        username: temporaryEmail,
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

  async validateUserExistsInPartner(userId: string, partnerId: string): Promise<boolean> {
    const source$ = this.userServiceClient
      .validateUserInPartner({ userId, partnerId })
      .pipe(timeout(3000));
    const response = await firstValueFrom(source$);

    return response.value || false;
  }

  async validateUserExistsInStore(userId: string, storeId: string): Promise<boolean> {
    const source$ = this.userServiceClient
      .validateUserInStore({ userId, storeId })
      .pipe(timeout(3000));
    const response = await firstValueFrom(source$);

    return response.value || false;
  }

  async getStoreById(storeId: string) {
    return firstValueFrom(this.partnerServiceClient.findStore({ id: storeId }));
  }

  async getPartnerById(partnerId: string) {
    return firstValueFrom(this.partnerServiceClient.getPartnerDetails({ id: partnerId }));
  }
}
