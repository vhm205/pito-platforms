import {
  CreateCateringPackageOptionRequest,
  CreateCateringPackageRequest,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  UpdateCateringPackageOptionRequest,
  UpdateCateringPackageRequest,
} from '@app/common';
import {
  CreateOccasionEventRequest,
  UpdateOccasionEventRequest,
} from '@app/common/types/proto/item/occasion-event';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ItemsService implements OnModuleInit {
  private menusService: MenusServiceClient;
  constructor(@Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc) {}

  onModuleInit() {
    this.menusService = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  // Catering package
  async createCateringPackage(request: CreateCateringPackageRequest) {
    const source$ = this.menusService.createCateringPackage(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async updateCateringPackage(request: UpdateCateringPackageRequest) {
    const source$ = this.menusService.updateCateringPackage(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async deleteCateringPackage(id: number) {
    const source$ = this.menusService.deleteCateringPackage({ id }).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  // Catering package option
  async createCateringPackageOption(request: CreateCateringPackageOptionRequest) {
    const source$ = this.menusService.createCateringPackageOption(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async updateCateringPackageOption(request: UpdateCateringPackageOptionRequest) {
    const source$ = this.menusService.updateCateringPackageOption(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async deleteCateringPackageOption(id: number) {
    const source$ = this.menusService.deleteCateringPackageOption({ id }).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async findAllCateringPackageOptions() {
    const source$ = this.menusService.findAllCateringPackageOptions({}).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async findCateringPackageOptionsByPackageId(packageId: number) {
    const source$ = this.menusService.getCateringPackageOptions({ packageId }).pipe(timeout(5000));
    return firstValueFrom(source$);
  }

  async findCateringPackagesAndOccasionEvents() {
    const source$ = this.menusService.findCateringPackagesAndOccasionEvents({}).pipe(timeout(5000));
    return firstValueFrom(source$);
  }

  // Occasion Event
  async createOccasionEvent(request: CreateOccasionEventRequest) {
    const source$ = this.menusService.createOccasionEvent(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async updateOccasionEvent(request: UpdateOccasionEventRequest) {
    const source$ = this.menusService.updateOccasionEvent(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async deleteOccasionEvent(id: number) {
    const source$ = this.menusService.deleteOccasionEvent({ id }).pipe(timeout(3000));
    return firstValueFrom(source$);
  }
}
