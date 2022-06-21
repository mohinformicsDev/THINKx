import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Device } from '../../device/entities/device.entity';

export type CustomerDocument = Customer & Document;

@Schema({
  timestamps: true
})
export class Customer {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  mobile: string;

  @Prop()
  oemId: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  profileImage: string;

  @Prop()
  armSync: string;
  
  @Prop()
  disArmSync: string;
  
  @Prop()
  lockSync: string;
  
  @Prop()
  unlockSync: string;

  @Prop({ ref: Device.name })
  devices: string[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
