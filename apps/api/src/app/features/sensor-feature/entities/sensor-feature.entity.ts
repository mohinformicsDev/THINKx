import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { Feature } from 'src/admin/product/feature/entities/feature.entity';

export type SensorFeatureDocument = SensorFeature & Document;

@Schema({
  timestamps: true
})
export class Message {
  @Prop()
  messageToRead: string;

  @Prop()
  actionToPerform: string;
}

export enum FeatureType {
  STATUS = 'status',
  TOGGLE = 'toggle',
  DROPDOWN = 'dropdown',
}

@Schema()
export class SensorFeature {
  @Prop()
  name: string;
  
  @Prop()
  syncfield: string;

  @Prop({ enum: FeatureType })
  featureType: FeatureType;

  @Prop()
  isEditable: boolean;

  @Prop()
  messages: Message[];

  @Prop()
  isEmergencyFeature: boolean;

  @Prop()
  hasValue: boolean;

  @Prop()
  dropDownValue: string;
}

export const SensorFeatureSchema = SchemaFactory.createForClass(SensorFeature);
