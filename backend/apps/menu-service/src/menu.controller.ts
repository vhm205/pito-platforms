import { Empty, MenusServiceController } from '@app/common';
import { Controller, Get } from '@nestjs/common';

import { MenuService } from './menu.service';

@Controller()
export class MenuController implements MenusServiceController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getHello(): string {
    return this.menuService.getHello();
  }

  async findMenus(dto: Empty): Promise<Empty> {
    return dto;
  }
}
