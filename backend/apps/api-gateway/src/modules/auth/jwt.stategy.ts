import { AllConfigType } from '@app/common/configs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUser } from './auth-user.interface';
import { KeycloakAdminService } from './keycloak-admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('external.supabase.jwtSecret', { infer: true }),
    });
  }

  async validate(args: { sub: string }): Promise<AuthUser> {
    // const observable = await this.usersService
    //   .findOneUser({ id: args.sub })
    //   .pipe(retry({ count: 3, delay: 3000 }));

    // const user = await firstValueFrom(observable);

    const [user, roleMappings] = await Promise.all([
      this.keycloakAdminService.getUserById(args.sub),
      this.keycloakAdminService.getRoleMappingByUserId(args.sub),
    ]);

    if (!user) {
      throw new UnauthorizedException();
    }

    const authUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: roleMappings?.clientMappings?.['application-cli']?.mappings || [],
    } as AuthUser;

    return authUser;
  }
}
