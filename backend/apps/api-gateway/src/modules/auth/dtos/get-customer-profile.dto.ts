import { ApiProperty } from '@nestjs/swagger';

class DeliveryAddress {
  @ApiProperty()
  name: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  default: boolean;
}

export class GetCustomerProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  contactAddress: string;

  @ApiProperty()
  deliveryAddresses: DeliveryAddress[];
}
