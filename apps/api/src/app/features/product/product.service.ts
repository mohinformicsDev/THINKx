import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Category } from '../category/entities/category.entity';
import { ProductFeature } from '../product-feature/entities/product-feature.entity';
import { ProductFeatureService } from '../product-feature/product-feature.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './entities/product.entity';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  create(createProductDto: CreateProductDto) {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll() {
    return this.productModel
      .find()
      .populate('category')
      .populate('features')
      .exec();

  }

  async findOne(id: string) {
    this.logger.log(id, 'id');

    try {
      const result = await this.productModel
        .findOne({ _id: id })
        .populate('category')
        .populate('features')
        .exec();
      if (!result) {
        this.logger.log('could not find the product.');
        throw new NotFoundException('Could not find the product.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException(error);
    }
  }

  findByCategoryId(categoryId) {
    return this.productModel
      .find({ category: categoryId })
      .populate('category')
      .populate('features');
  }

  async update(id: string, updateProductDto: UpdateQuery<ProductDocument>) {
    try {
      const result = await this.productModel
        .updateOne({ _id: id }, updateProductDto)
        .exec();
      if (result.n === 0) {
        this.logger.log('', 'could not find the product to update.');
        throw new NotFoundException('could not find the product to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error, 'error');
      throw new NotFoundException(error);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.productModel.deleteOne({ _id: id }).exec();
      if (result.n === 0) {
        this.logger.log('Could not find the product to delete.');
        throw new NotFoundException('Could not find the product to delete.');
      }
      return result;
    } catch (error) {
      this.logger.log(error, 'error');
      throw new NotFoundException('Could not find the product to delete.');
    }
  }

  async totalCount() {
    return this.productModel.countDocuments();
  }
}
