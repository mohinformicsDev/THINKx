import { Test, TestingModule } from '@nestjs/testing';
import { SensorFeatureController } from './sensor-feature.controller';
import { SensorFeatureService } from './sensor-feature.service';

describe('SensorFeatureController', () => {
  let controller: SensorFeatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorFeatureController],
      providers: [SensorFeatureService],
    }).compile();

    controller = module.get<SensorFeatureController>(SensorFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
