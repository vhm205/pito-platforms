import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';

import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [LoggerModule.forRoot({ service: MenuService.name })],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
