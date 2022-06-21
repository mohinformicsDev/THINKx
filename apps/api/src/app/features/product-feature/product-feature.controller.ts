import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductFeatureService } from './product-feature.service';
import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { UpdateProductFeatureDto } from './dto/update-product-feature.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('product-feature')
@Controller('product-feature')
export class ProductFeatureController {
  constructor(private readonly productFeatureService: ProductFeatureService) { }

  @Post()
  @ApiBody({ type: CreateProductFeatureDto })
  create(@Body() createProductFeatureDto: CreateProductFeatureDto) {
    return this.productFeatureService.create(createProductFeatureDto);
  }

  @Get()
  findAll() {
    return this.productFeatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFeatureService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductFeatureDto: UpdateProductFeatureDto
  ) {
    return this.productFeatureService.update(id, updateProductFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFeatureService.remove(id);
  }
}
