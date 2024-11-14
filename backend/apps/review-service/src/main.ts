import { LoggerService } from '@app/common';
import { NestFactory } from '@nestjs/core';

import { ReviewServiceModule } from './review-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ReviewServiceModule);
  app.useLogger(app.get(LoggerService));

  await app.listen(3000);
}

void bootstrap();
