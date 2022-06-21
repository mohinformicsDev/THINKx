import { Test, TestingModule } from '@nestjs/testing';
import { ProductFeatureController } from './product-feature.controller';
import { ProductFeatureService } from './product-feature.service';

describe('ProductFeatureController', () => {
  let controller: ProductFeatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFeatureController],
      providers: [ProductFeatureService],
    }).compile();

    controller = module.get<ProductFeatureController>(ProductFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
