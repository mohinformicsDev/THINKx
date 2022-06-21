import { Test, TestingModule } from '@nestjs/testing';
import { ProductFeatureService } from './product-feature.service';

describe('ProductFeatureService', () => {
  let service: ProductFeatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFeatureService],
    }).compile();

    service = module.get<ProductFeatureService>(ProductFeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
