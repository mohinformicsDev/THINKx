import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductFeature,
  ProductFeatureSchema,
} from './entities/product-feature.entity';
import { ProductFeatureController } from './product-feature.controller';
import { ProductFeatureService } from './product-feature.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductFeature.name, schema: ProductFeatureSchema },
    ]),
  ],
  controllers: [ProductFeatureController],
  providers: [ProductFeatureService],
  exports: [ProductFeatureService],
})
export class ProductFeatureModule { }
