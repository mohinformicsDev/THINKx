import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductService } from '../product/product.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    private productService: ProductService
  ) {}

  create(createCatDto: CreateCategoryDto): Promise<CategoryDocument> {
    const createdCategory = new this.categoryModel(createCatDto);
    return createdCategory.save();
  }

  findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    try {
      this.logger.log('hello');
      const result = await this.categoryModel.find({ _id: id }).exec();

      if (result.length === 0) {
        this.logger.log('Could not find the category.');
        throw new NotFoundException('Could not find the category.');
      }

      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const result = await this.categoryModel
        .updateOne({ _id: id }, updateCategoryDto)
        .exec();
      if (result.n === 0) {
        this.logger.log('could not find category to update.');
        throw new NotFoundException('could not find category to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productService.findByCategoryId(id);

      if (product) {
        this.logger.log(product, 'Product is assigned to some category');

        throw new HttpException(
          'Category is assinged to product can not be deleted',
          HttpStatus.BAD_REQUEST
        );
      }
      this.logger.log(product, 'Category is not associated with any product');

      const result = await this.categoryModel.deleteOne({ _id: id }).exec();

      if (result.n === 0) {
        this.logger.log('Could not find the category to delete n=0.');

        throw new NotFoundException(
          'Could not find the category to delete n=0.'
        );
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException(error);
    }
  }
}
