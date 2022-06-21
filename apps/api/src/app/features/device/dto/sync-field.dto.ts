import { ApiProperty } from '@nestjs/swagger';

export class SyncDevice {
  @ApiProperty()
  data: string;
}
