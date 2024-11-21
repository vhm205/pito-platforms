import 'dotenv/config';
import { LoggerService } from '@app/common';
import { AllConfigType, AppConfig } from '@app/common/configs';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import './instrument';

import { AppModule } from './app.module';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import { validationOptions } from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('PITO API')
    .setDescription('PITO API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

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
