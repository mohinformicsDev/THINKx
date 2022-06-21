import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from '../../product/entities/product.entity';

export type DeviceDocument = Device & Document;

@Schema({
  timestamps: true
})
export class Device {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ unique: true })
  deviceId: string;

  @Prop()
  registrationKey: string;

  @Prop()
  devicePassword: string;

  @Prop()
  warrantyDays: number;

  @Prop()
  manufactureDate: string;

  @Prop({ default: false })
  status: boolean;

  @Prop({ default: false })
  active: boolean;

  @Prop()
  soldTo: string;

  @Prop({ ref: Product.name })
  productType: string;

  @Prop({ default: '' })
  customerId: string;

  @Prop()
  oemId: string;

  @Prop()
  enrollmentDate: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
