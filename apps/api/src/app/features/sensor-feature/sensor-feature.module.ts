import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SensorFeature,
  SensorFeatureSchema,
} from './entities/sensor-feature.entity';
import { SensorFeatureController } from './sensor-feature.controller';
import { SensorFeatureService } from './sensor-feature.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SensorFeature.name, schema: SensorFeatureSchema },
    ]),
  ],
  controllers: [SensorFeatureController],
  providers: [SensorFeatureService],
})
export class SensorFeatureModule { }
