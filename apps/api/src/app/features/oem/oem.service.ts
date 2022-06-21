import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOemDto } from './dto/create-oem.dto';
import { UpdateOemDto } from './dto/update-oem.dto';
import { Oem, OemDocument } from './entities/oem.entity';

@Injectable()
export class OemService {
  private readonly logger = new Logger(OemService.name);

  constructor(@InjectModel(Oem.name) private oemModel: Model<OemDocument>) {}

  async create(createOemDto: CreateOemDto) {
    const createdOem = new this.oemModel(createOemDto);
    return createdOem.save();
  }

  async findAll() {
    const result = await this.oemModel.find();
    return result;
  }

  async findOne(id: string) {
    try {
      const result = await this.oemModel.findOne({ _id: id });
      this.logger.log(result, 'Find by id');
      if (result == undefined) {
        throw new NotFoundException('Could not find the oem.');
      }
      return result;
    } catch (error) {
      this.logger.log(error, 'find oem error');
      throw new NotFoundException('Could not find the oem.');
    }
  }

  async findByOemId(oemId: string) {
    try {
      this.logger.log(oemId, 'OEMID');
      let result = await this.oemModel.findOne({ oemId: oemId });

      if (!result) {
        throw new NotFoundException('Could not find the oem.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException(error);
    }
  }

  async update(id: string, updateOemDto: UpdateOemDto) {
    try {
      const result = await this.oemModel
        .updateOne({ _id: id }, updateOemDto)
        .exec();
      if (result.n === 0) {
        this.logger.log('could not find the oem to update.');
        throw new NotFoundException('could not find the oem to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException(error);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.oemModel.deleteOne({ _id: id }).exec();

      if (result.n === 0) {
        throw new NotFoundException('Could not find the oem to delete.');
      }
      return result;
    } catch (error) {
      throw new NotFoundException('Could not find the oem to delete.');
    }
  }

  async totalCount() {
    try {
      return await this.oemModel.countDocuments();
    } catch (error) {
      throw new NotFoundException('Could not find the Oem.');
    }
  }
}
