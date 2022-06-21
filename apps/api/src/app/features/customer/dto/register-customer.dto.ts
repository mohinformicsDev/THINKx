import { ApiProperty } from '@nestjs/swagger';

export class RegisterCustomerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

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
  profileImage: string;
}
