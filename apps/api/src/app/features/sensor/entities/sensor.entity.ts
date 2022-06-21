import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SensorFeature } from '../../sensor-feature/entities/sensor-feature.entity';
import * as mongoose from 'mongoose';

export type SensorDocument = Sensor & Document;

@Schema({
  timestamps: true
})
export class Sensor {
  @Prop()
  name: string;
  
  @Prop()
  syncfield: string;
  
  @Prop()
  imageUrl: string;

  @Prop({ ref: SensorFeature.name })
  features: string[];

  @Prop()
  armMessageToRead: string;

  @Prop()
  armMessageToSend: string;

  @Prop()
  disArmMessageToRead: string;

  @Prop()
  disArmMessageToSend: string;

  @Prop()
  setTimerMessageToRead: string;

  @Prop()
  setTimerMessageToSend: string;

  @Prop()
  getTimerMessageToRead: string;

  @Prop()
  getTimerMessageToSend: string;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);
