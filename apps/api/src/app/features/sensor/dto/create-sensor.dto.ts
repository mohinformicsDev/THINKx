import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDto {
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  syncfield: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  features: string[];

  @ApiProperty()
  armMessageToRead: string;

  @ApiProperty()
  armMessageToSend: string;

  @ApiProperty()
  disArmMessageToRead: string;

  @ApiProperty()
  disArmMessageToSend: string;

  @ApiProperty()
  setTimerMessageToRead: string;

  @ApiProperty()
  setTimerMessageToSend: string;

  @ApiProperty()
  getTimerMessageToRead: string;

  @ApiProperty()
  getTimerMessageToSend: string;
}
