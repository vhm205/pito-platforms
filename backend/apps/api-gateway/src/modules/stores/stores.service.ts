import {
  CalculateDistanceRequest,
  GetItemInStoreRequest,
  GetStoreByFilterRequest,
  GetStoreDetailForCustomerRequest,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
  UpdateStoreStatusRequest,
  USER_SERVICE,
  USERS_SERVICE_NAME,
  UsersServiceClient,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { timeout, firstValueFrom } from 'rxjs';

@Injectable()
export class StoresService {
  private menuService: MenusServiceClient;
  private orderService: OrdersServiceClient;
  private userServiceClient: UsersServiceClient;

  constructor(
    @Inject(MENU_SERVICE) private client: ClientGrpc,
    @Inject(ORDER_SERVICE) private orderClient: ClientGrpc,
    @Inject(USER_SERVICE) private readonly userClient: ClientGrpc,
  ) {
    this.menuService = this.client.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
    this.orderService = this.orderClient.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
    this.userServiceClient = this.userClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  searchStores(params: GetStoreByFilterRequest) {
    const source$ = this.menuService.findStoresByFilter(params).pipe(timeout(5000));
    return firstValueFrom(source$);
  }

  getItemsInStore(params: GetItemInStoreRequest) {
    const source$ = this.menuService.findItemsInStore(params).pipe(timeout(5000));
    return firstValueFrom(source$);
  }

  getFilterOptions(keyword: string) {
    const source$ = this.menuService.getFilterOptions({ keyword }).pipe(timeout(2000));
    return firstValueFrom(source$);
  }

  async calculateDistance(params: CalculateDistanceRequest) {
    const source$ = this.menuService.calculateDistance(params).pipe(timeout(2000));
    return firstValueFrom(source$);
  }

  async getStoreDetailForCustomer(request: GetStoreDetailForCustomerRequest) {
    const store = await firstValueFrom(
      this.menuService.getStoreDetailForCustomer(request).pipe(timeout(2000)),
    );
    const totalData = await firstValueFrom(
      this.orderService.getTotalOrderCountByStoreId({ storeId: store.id }).pipe(timeout(2000)),
    );

    return { ...store, totalOrdersCompleted: totalData.totalOrderCount };
  }

  updateStoreStatusByIds(request: UpdateStoreStatusRequest) {
    const source$ = this.menuService.updateStoreStatus(request).pipe(timeout(2000));
    return firstValueFrom(source$);
  }

  getUsersStore(storeId: string) {
    const source$ = this.userServiceClient
      .getUsersInStore({
        storeId,
        filters: [],
        pagination: undefined,
        sorts: [],
      })
      .pipe(timeout(2000));
    return firstValueFrom(source$);
  }
}
