import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from '../../category/entities/category.entity';
import { ProductFeature } from '../../product-feature/entities/product-feature.entity';
export type ProductDocument = Product & Document;

@Schema({
  timestamps: true
})
export class Product {
  @Prop()
  name: string;

  @Prop()
  numberOfUser: number;

  @Prop({ ref: Category.name })
  category: string;

  @Prop()
  imageUrls: string;

  @Prop({ type: [], ref: ProductFeature.name })
  features: ProductFeature[];

  @Prop()
  armMessageToRead: string;

  @Prop()
  disArmMessageToRead: string;

  @Prop()
  sirenOnMessageToRead: string;

  @Prop()
  sirenOffMessageToRead: string;

  @Prop()
  armMessageToSend: string;

  @Prop()
  disArmMessageToSend: string;

  @Prop()
  sirenOnMessageToSend: string;

  @Prop()
  sirenOffMessageToSend: string;

  @Prop()
  armedHighlightImage: string;
  
  @Prop()
  disArmedHighlightImage: string;

  @Prop()
  alertOnHighlightImage: string;

  @Prop()
  alertOffHighlightImage: string;

  @Prop()
  armedUnhighlightImage: string;

  @Prop()
  disArmedUnhighlightImage: string;

  @Prop()
  alertOnUnhighlightImage: string;

  @Prop()
  alertOffUnhighlightImage: string;
  
  @Prop()
  armSync: string

  @Prop()
  disArmSync: string

  @Prop()
  lockSync: string

  @Prop()
  unlockSync: string


  @Prop()
  productManual: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
