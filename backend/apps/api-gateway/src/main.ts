import 'dotenv/config';
import { Logger } from '@app/common';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';

import './instrument';

import { AppModule } from './app.module';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { validationOptions } from './utils/validation-options';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@app/common/configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  /**
    ResolvePromisesInterceptor is used to resolve promises in responses 
    because class-transformer can't do it.
    https://github.com/typestack/class-transformer/issues/549
   */
  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen(configService.get('app.apiGatewayPort', { infer: true }));
}

void bootstrap();
