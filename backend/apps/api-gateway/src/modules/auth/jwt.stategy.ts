import { AllConfigType, AppConfig, ExternalConfig } from '@app/common/configs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IncomingWebhook } from '@slack/webhook';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthenticatedUser } from './auth-user.interface';
import { KeycloakAdminService } from './keycloak-admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('external.supabase.jwtSecret', { infer: true }),
    });
  }

  async validate(args: { sub: string }): Promise<AuthenticatedUser> {
    // const observable = await this.usersService
    //   .findOneUser({ id: args.sub })
    //   .pipe(retry({ count: 3, delay: 3000 }));

    // const user = await firstValueFrom(observable);

    const [user, roleMappings] = await Promise.all([
      this.keycloakAdminService.getUserById(args.sub),
      this.keycloakAdminService.getRoleMappingByUserId(args.sub),
    ]);

    const webhook = new IncomingWebhook(
      this.configService.get<ExternalConfig>('external.slack.webhookUrl', {
        infer: true,
      }) as string,
    );

    if (!user) {
      const nodeEnv = this.configService.get<AppConfig>('app.nodeEnv', { infer: true });

      webhook.send({
        text: `[${nodeEnv}] User with id "${args.sub}" not found`,
      });

      throw new UnauthorizedException(`User with id ${args.sub} not found`);
    }

    const authUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: roleMappings?.clientMappings?.['application-cli']?.mappings || [],
    } as AuthenticatedUser;

    return authUser;
  }
}
