import { USER_SERVICE, User, USERS_SERVICE_NAME, UsersServiceClient } from '@app/common';
import { AllConfigType } from '@app/common/configs';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom, retry } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private usersService: UsersServiceClient;

  constructor(
    @Inject(USER_SERVICE) private client: ClientGrpc,
    configService: ConfigService<AllConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('external.supabase.jwtSecret', { infer: true }),
    });
  }

  onModuleInit() {
    this.usersService = this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  async validate(args: { sub: string }): Promise<User> {
    const observable = await this.usersService
      .findOneUser({ id: args.sub })
      .pipe(retry({ count: 3, delay: 3000 }));

    const user = await firstValueFrom(observable);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
