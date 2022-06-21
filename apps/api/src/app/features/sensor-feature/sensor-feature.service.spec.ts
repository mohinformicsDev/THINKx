import { Test, TestingModule } from '@nestjs/testing';
import { SensorFeatureService } from './sensor-feature.service';

describe('SensorFeatureService', () => {
  let service: SensorFeatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorFeatureService],
    }).compile();

    service = module.get<SensorFeatureService>(SensorFeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
