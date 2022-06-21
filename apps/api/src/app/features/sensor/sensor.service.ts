import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor, SensorDocument } from './entities/sensor.entity';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);

  constructor(
    @InjectModel(Sensor.name) private sensorModel: Model<SensorDocument>
  ) {}

  async create(createSensorDto: CreateSensorDto) {
    const createdSensor = new this.sensorModel(createSensorDto);
    return createdSensor.save();
  }

  async findAll() {
    return this.sensorModel.find().populate('features').exec();
  }

  async findOne(id: string) {
    try {
      const result = await this.sensorModel
        .findOne({ _id: id })
        .populate('features')
        .exec();

      if (!result) {
        throw new NotFoundException('Could not find the sensor.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the sensor.');
    }
  }

  async update(id: string, updateSensorDto: UpdateQuery<SensorDocument>) {
    try {
      const result = await this.sensorModel
        .updateOne({ _id: id }, updateSensorDto)
        .exec();
      if (result.n === 0) {
        throw new NotFoundException('could not find the sensor to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the sensor to update.');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.sensorModel.deleteOne({ _id: id }).exec();

      if (result.n === 0) {
        throw new NotFoundException('Could not find the sensor to delete.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the sensor to delete.');
    }
  }
}
