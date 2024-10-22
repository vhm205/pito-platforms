import { NestFactory } from '@nestjs/core';

import { ReviewServiceModule } from './review-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ReviewServiceModule);
  await app.listen(3000);
}
bootstrap();
