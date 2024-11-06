import { NestFactory } from '@nestjs/core';

import { ReviewServiceModule } from './review-service.module';
import { LoggerService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ReviewServiceModule);
  app.useLogger(app.get(LoggerService));

  await app.listen(3000);
}

void bootstrap();
