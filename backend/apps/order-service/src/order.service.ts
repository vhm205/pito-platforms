import { convertObjectKeysToCamelCase } from '@app/common';
import { OrderFilterDto } from '@app/common/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async findOrders(
    orderFilterDto: OrderFilterDto,
  ): Promise<{ orders: OrderEntity[]; total: number }> {
    const [rowResponse, totalResponse] = await Promise.all([
      this.orderRepository.query(
        'SELECT * FROM get_history_orders_by_filter($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [
          orderFilterDto.userId,
          orderFilterDto.keyword,
          orderFilterDto.status,
          orderFilterDto.fromDate,
          orderFilterDto.toDate,
          orderFilterDto.deliveryDate,
          orderFilterDto.sortBy,
          orderFilterDto.sortDirection,
          orderFilterDto.pageSize,
          orderFilterDto.from,
        ],
      ),
      this.orderRepository.query(
        'SELECT * FROM get_total_orders_history_by_filter($1, $2, $3, $4, $5, $6)',
        [
          orderFilterDto.userId,
          orderFilterDto.keyword,
          orderFilterDto.status,
          orderFilterDto.fromDate,
          orderFilterDto.toDate,
          orderFilterDto.deliveryDate,
        ],
      ),
    ]);

    const orders = convertObjectKeysToCamelCase(rowResponse) as OrderEntity[];
    const total = totalResponse![0]!['get_total_orders_history_by_filter'] || 0;

    return { orders, total };
  }

  async findOneOrder(orderId: string): Promise<OrderEntity | null> {
    const order = await this.orderRepository.findOne({ where: { orderId } });

    return order || null;
  }
}
