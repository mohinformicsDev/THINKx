import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty()
  messageToRead: string;

  @ApiProperty()
  actionToPerform: string;
}

export enum FeatureType {
  STATUS = 'status',
  TOGGLE = 'toggle',
  DROPDOWN = 'dropdown'
}

export class CreateSensorFeatureDto {
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  syncfield: string;

  @ApiProperty({ enum: FeatureType })
  featureType: FeatureType;

  @ApiProperty()
  isEditable: boolean;

  @ApiProperty({ type: [Message] })
  messages: Message[];

  @ApiProperty()
  isEmergencyFeature: boolean;

  @ApiProperty()
  hasValue: boolean;
  
  @ApiProperty()
  dropDownValue: string;
}
