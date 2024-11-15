import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
// eslint-disable-next-line max-len
import MappingsRepresentation from '@keycloak/keycloak-admin-client/lib/defs/mappingsRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'cache-manager-redis-yet';

@Injectable()
export class KeycloakAdminService implements OnModuleInit {
  private keycloakAdmin: KeycloakAdminClient;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
  ) {}

  async onModuleInit() {
    this.keycloakAdmin = new KeycloakAdminClient({
      baseUrl: this.configService.get<string>('KEYCLOAK_BASE_URL'),
      realmName: this.configService.get<string>('KEYCLOAK_REALM'),
    });

    await this.keycloakAdmin.auth({
      username: this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME'),
      password: this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD'),
      grantType: 'password',
      clientId: this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_ID') as string,
      clientSecret: this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_SECRET'),
    });
  }

  private async refreshTokenIfExpired() {
    try {
      await this.keycloakAdmin.users.count();
    } catch (error) {
      if (
        error instanceof Error &&
        'response' in error &&
        (error as any).response?.status === 401
      ) {
        await this.keycloakAdmin.auth({
          username: this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME'),
          password: this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD'),
          grantType: 'password',
          clientId: this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_ID') as string,
          clientSecret: this.configService.get<string>('KEYCLOAK_ADMIN_CLIENT_SECRET'),
        });
      }
    }
  }

  async getUserById(userId: string) {
    const cacheKey = `keycloak:user:${userId}`;

    const cachedUser = await this.cacheManager.get(cacheKey);

    if (cachedUser) return cachedUser as UserRepresentation;

    await this.refreshTokenIfExpired();

    const user = await this.keycloakAdmin.users.findOne({
      id: userId,
    });

    await this.cacheManager.set(cacheKey, user, 5 * 60 * 1000);

    return user;
  }

  async getRoleMappingByUserId(userId: string) {
    const cacheKey = `keycloak:user-roles:${userId}`;

    const cachedRoleMappings = await this.cacheManager.get(cacheKey);

    if (cachedRoleMappings) return cachedRoleMappings as MappingsRepresentation;

    await this.refreshTokenIfExpired();

    const roleMappings = await this.keycloakAdmin.users.listRoleMappings({ id: userId });

    await this.cacheManager.set(cacheKey, roleMappings, 5 * 60 * 1000);

    return roleMappings;
  }
}
