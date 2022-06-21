import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSensorFeatureDto } from './dto/create-sensor-feature.dto';
import { UpdateSensorFeatureDto } from './dto/update-sensor-feature.dto';
import {
  SensorFeature,
  SensorFeatureDocument,
} from './entities/sensor-feature.entity';

@Injectable()
export class SensorFeatureService {
  private readonly logger = new Logger(SensorFeatureService.name);

  constructor(
    @InjectModel(SensorFeature.name)
    private sensorFeatureModel: Model<SensorFeatureDocument>
  ) { }

  create(createSensorFeatureDto: CreateSensorFeatureDto) {
    const createdSensor = new this.sensorFeatureModel(createSensorFeatureDto);
    return createdSensor.save();
  }

  findAll() {
    return this.sensorFeatureModel.find().exec();
  }

  async findOne(id: string) {
    try {
      const result = await this.sensorFeatureModel.find({ _id: id }).exec();
      if (result.length === 0) {
        throw new NotFoundException('Could not find the product.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the product.');
    }
  }

  async update(id: string, updateSensorFeatureDto: UpdateSensorFeatureDto) {
    try {
      const result = await this.sensorFeatureModel
        .updateOne({ _id: id }, updateSensorFeatureDto)
        .exec();
      if (result.n === 0) {
        throw new NotFoundException('could not find the product to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the product to update.');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.sensorFeatureModel
        .deleteOne({ _id: id })
        .exec();
      if (result.n === 0) {
        throw new NotFoundException('Could not find the product to delete.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the product to delete.');
    }
  }
}
