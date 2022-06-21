import { PartialType } from '@nestjs/swagger';
import { CreateSensorFeatureDto } from './create-sensor-feature.dto';

export class UpdateSensorFeatureDto extends PartialType(CreateSensorFeatureDto) {}
