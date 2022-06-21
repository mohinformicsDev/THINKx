import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  registrationKey: string;

  @ApiProperty()
  devicePassword: string;

  @ApiProperty()
  warrantyDays: number;

  @ApiProperty()
  manufactureDate: string;

  @ApiProperty({ default: false })
  status: boolean;

  @ApiProperty({ default: false })
  active: boolean;

  @ApiProperty()
  soldTo: string;

  @ApiProperty()
  productType: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  oemId: string;

  @ApiProperty()
  enrollmentDate: string;
}
