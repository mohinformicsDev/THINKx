import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  pincode: number;

  @ApiProperty()
  mobile: string;

  @ApiProperty()
  oemId: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  address: string;

  @ApiProperty()  
  armSync: string;
  
  @ApiProperty()  
  disArmSync: string;
  
  @ApiProperty()  
  lockSync: string;
  
  @ApiProperty()  
  unlockSync: string;
  
}
