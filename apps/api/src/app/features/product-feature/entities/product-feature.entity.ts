import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { Feature } from 'src/admin/product/feature/entities/feature.entity';

export type ProductFeatureDocument = ProductFeature & Document;

@Schema()
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
  TIMER = 'timer',
  REMINDER = 'reminder',
  TOGGLETIMER = 'toggle + timer',
  STATUSTEXTFIELD = 'status + text-field',
  TOGGLEDROPDOWN = 'toggle + dropdown',
  TOGGLEREMINDER = 'toggle + reminder',
  MASTERRESET = 'master reset',
  CHANGEPASSWORD= 'change password',
}


@Schema({
  timestamps: true
})
export class ProductFeature {
  @Prop()
  name: string;

  @Prop({ enum: FeatureType })
  featureType: FeatureType;

  @Prop()
  isEditable: boolean;

  @Prop()
  messages: Message[];

  @Prop()
  isEmergencyFeature: boolean;

  @Prop()
  imageUrl: string;

  @Prop()
  syncField: string;

  @Prop()
  isInformerEditor: boolean;

  @Prop()
  userType: string;

  @Prop()
  requirePassword: boolean;

  @Prop()
  requireRefresh: boolean;

  @Prop()
  hasValue: boolean;
  
  @Prop()
  dropDownValue: string;
}

export const ProductFeatureSchema = SchemaFactory.createForClass(
  ProductFeature
);
