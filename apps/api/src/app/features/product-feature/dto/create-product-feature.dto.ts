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
  DROPDOWN = 'dropdown',
  TIMER = 'timer',
  REMINDER = 'reminder',
  TOGGLETIMER = 'toggle + timer',
  STATUSTEXTFIELD = 'status + text-field',
  TOGGLEDROPDOWN = 'toggle + dropdown',
  TOGGLEREMINDER = 'toggle + reminder',
  MASTERRESET = 'master reset',
  CHANGEPASSWORD= 'change password',
}


export class CreateProductFeatureDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: FeatureType })
  featureType: FeatureType;

  @ApiProperty()
  isEditable: boolean;

  @ApiProperty({ type: [Message] })
  messages: Message[];

  @ApiProperty()
  isEmergencyFeature: boolean;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  syncField: string;

  @ApiProperty()
  isInformerEditor: boolean;

  @ApiProperty()
  userType: string;

  @ApiProperty()
  requirePassword: boolean;

  @ApiProperty()
  requireRefresh: boolean;
}
