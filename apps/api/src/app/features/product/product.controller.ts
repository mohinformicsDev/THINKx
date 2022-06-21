import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateQuery } from 'mongoose';;
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDocument } from './entities/product.entity';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiBody({
    type: CreateProductDto,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('category/:id')
  async findByCategory(@Param('id') id: string) {
    // find products by category
    try {
      const result = await this.productService.findByCategoryId(id);
      if (result.length == 0) {
        throw new NotFoundException('could not find the product by category id.');
      }
      return result;
    } catch (error) {
      this.logger.log(error, 'findByCategoryId error ')
      throw new NotFoundException('could not find the product by category id.');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(id, 'Find one product')
    return this.productService.findOne(id);
  }

  // @Get('category/:id')
  // findByCategoryId(@Param('id') id: string) {
  //   return this.productService.findByCategoryId(id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateQuery<ProductDocument>
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
