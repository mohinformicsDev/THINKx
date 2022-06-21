import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceApiDto {
  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  registrationKey: string;

  @ApiProperty({ default: false })
  active: boolean;

  @ApiProperty()
  devicePassword: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  oemId: string;

  @ApiProperty()
  productType: string;

  @ApiProperty()
  enrollmentDate: string;
}
