import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product-feature.dto';
import {
  ProductFeature,
  ProductFeatureDocument,
} from './entities/product-feature.entity';

@Injectable()
export class ProductFeatureService {
  private readonly logger = new Logger(ProductFeatureService.name);

  constructor(
    @InjectModel(ProductFeature.name)
    private productFeatureModel: Model<ProductFeatureDocument>
  ) { }

  create(createProductFeatureDto: CreateProductFeatureDto) {
    const createdProduct = new this.productFeatureModel(
      createProductFeatureDto
    );
    return createdProduct.save();
  }

  findAll() {
    return this.productFeatureModel.find().exec();
  }

  async findOne(id: string) {
    try {
      const result = await this.productFeatureModel.find({ _id: id }).exec();

      if (result.length === 0) {
        throw new NotFoundException('Could not find the product.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the product.');
    }
  }

  async findByIds(ids: string[]) {
    try {
      const results = await this.productFeatureModel
        .find()
        .where('_id')
        .in(ids)
        .exec();
      // const result = await this.productFeatureModel.find().exec();

      if (results.length === 0) {
        throw new NotFoundException('Could not find the product.');
      }
      return results;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the product.');
    }
  }

  async update(id: string, updateProductFeatureDto: UpdateProductFeatureDto) {
    try {
      const result = await this.productFeatureModel
        .updateOne({ _id: id }, updateProductFeatureDto)
        .exec();
      if (result.n === 0) {
        throw new NotFoundException('could not find the product to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the product to update.');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.productFeatureModel
        .deleteOne({ _id: id })
        .exec();

      if (result.n === 0) {
        throw new NotFoundException('Could not find the product to delete.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);

      throw new NotFoundException('Could not find the product to delete.');
    }
  }
}
