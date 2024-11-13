import { LoggerService } from '@app/common';
import { NestFactory } from '@nestjs/core';

import { PromotionServiceModule } from './promotion-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PromotionServiceModule);
  app.useLogger(app.get(LoggerService));
  await app.listen(3000);
}

void bootstrap();
