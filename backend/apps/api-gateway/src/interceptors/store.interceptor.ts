import { AuthenticatedStore } from '@gateway/modules/auth/auth-user.interface';
import { AuthService } from '@gateway/modules/auth/auth.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StoreInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { store_id: storeId } = request.query;

    if (!storeId) {
      return next.handle();
    }

    const storeResponse = await this.authService.getStoreById(storeId);

    if (!storeResponse || !storeResponse.store) {
      throw new BadRequestException(`Store not found for ID: ${storeId}`);
    }

    request.store = {
      id: storeResponse.store.id,
      name: storeResponse.store.name,
    } as AuthenticatedStore;

    return next.handle();
  }
}
