import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { LoggerService } from '@app/common';
import type { AllConfigType, AppConfig } from '@app/common/configs';

import './instrument';

import { AppModule } from './app.module';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { validationOptions } from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.useLogger(app.get(LoggerService));
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

  const PORT = configService.get<AppConfig>('app.apiGatewayPort', { infer: true });
  await app.listen(PORT);
}

void bootstrap();
