import { NestFactory } from '@nestjs/core';

import { PromotionServiceModule } from './promotion-service.module';
import { LoggerService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PromotionServiceModule);
  app.useLogger(app.get(LoggerService));
  await app.listen(3000);
}

void bootstrap();
