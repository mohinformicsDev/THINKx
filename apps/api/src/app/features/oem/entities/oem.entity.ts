import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { Product } from '../../product/entities/product.entity';
import { Sensor } from '../../sensor/entities/sensor.entity';
// import { Category } from './../../../admin/category/entities/category.entity';
// import { Product } from './../../../admin/product/entities/product.entity';
// import { Sensor } from './../../../admin/sensor/entities/sensor.entity';

export type OemDocument = Oem & Document;

@Schema({
  timestamps: true
})
export class Oem {
  @Prop()
  id: string;

  @Prop()
  oemName: string;

  @Prop()
  oemId: string;

  @Prop()
  bugReportEmail: string;

  @Prop()
  endUserAgreement: string[];

  @Prop()
  productProfile: string[];

  @Prop()
  companyProfile: string[];

  @Prop()
  userManualLink: string;

  @Prop()
  status: boolean;

  @Prop()
  oemLogo: string;

  @Prop()
  marketingImageUrl: string[];

  @Prop({ ref: Category.name })
  category: Category[];

  @Prop({ ref: Product.name })
  product: Product[];

  @Prop({ ref: Sensor.name })
  sensor: Sensor[];
}

export const OemSchema = SchemaFactory.createForClass(Oem);
