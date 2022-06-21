import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerService } from '../customer/customer.service';
import { OemService } from '../oem/oem.service';
import { CreateDeviceApiDto } from './dto/create-device-api.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceDocument, Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectModel(Device.name)
    private deviceModel: Model<DeviceDocument>,
    private oemService: OemService,
    private customerService: CustomerService
  ) { }

  async create(
    createDeviceDto: CreateDeviceDto | [CreateDeviceDto]
  ): Promise<DeviceDocument> {
    const createdDevice = await new this.deviceModel(createDeviceDto);
    return createdDevice.save();
  }

  async createDeviceApi(
    createDeviceApiDto: CreateDeviceApiDto
  ): Promise<DeviceDocument> {
    const createdDeviceApi = new this.deviceModel(createDeviceApiDto);
    return createdDeviceApi.save();
  }

  importDevice(createDeviceDto: Array<CreateDeviceDto>) {
    const devicePromise = createDeviceDto.map((x) => {
      const createdDevice = new this.deviceModel(x);
      return createdDevice.save();
    });
    return Promise.all(devicePromise);
  }

  findAll() {
    return this.deviceModel.find().exec();
  }

  findOne(id: string) {
    return this.deviceModel.findOne({ _id: id }).exec();
  }

  findByDeviceId(deviceId: string) {
    return this.deviceModel.findOne({ deviceId: deviceId }).exec();
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    try {
      this.logger.log(updateDeviceDto, 'updateDeviceDto');
      this.logger.log(id, 'id');
      const result = await this.deviceModel
        .updateOne({ _id: id }, updateDeviceDto)
        .exec();
      this.logger.log(result, 'result');
      if (!result) {
        throw new NotFoundException('Could not find the device to update.');
      }
      return result;
    } catch (error) {
      throw new NotFoundException('Could not find the device to update.');
    }
  }

  async remove(id: string) {
    const result = await this.deviceModel.deleteOne({ _id: id }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find the device to delete.');
    }
  }

  totalCount() {
    return this.deviceModel.countDocuments();
  }

  // !register
  async register(createDeviceApiDto: CreateDeviceApiDto) {
    try {
      // const deviceData = await this.findOne(createDeviceApiDto);
      const deviceData = await this.findByDeviceId(createDeviceApiDto.deviceId);
      if (deviceData) {
        const fetchedDeviceData = deviceData;

        /**
         * * Check device product is same 
         **/

        if (deviceData.productType === createDeviceApiDto.productType) {
          /**
         * * checking device status field by admin
         * * checking device active field by customer
         */
          if (
            fetchedDeviceData.status === true &&
            fetchedDeviceData.active === false
          ) {
            /**
             * * checking device password
             */
            // fetchedDeviceData.devicePassword ===
            // createDeviceApiDto.devicePassword
            if (true) {
              // fetching oem
              const oemData = await this.oemService.findByOemId(
                createDeviceApiDto.oemId
              );
              this.logger.log(oemData, 'OEM DATA');
              if (oemData) {
                const deviceUpdateResult = await this.update(deviceData._id, {
                  active: true,
                  customerId: createDeviceApiDto.customerId,
                  enrollmentDate: createDeviceApiDto.enrollmentDate
                });
                this.logger.log(deviceUpdateResult, 'deviceUpdateResult');
                // const deviceData = await this.findByDeviceId(createDeviceApiDto.deviceId);
                const result = await this.customerService.updateCustomerDevice(
                  createDeviceApiDto.customerId,
                  deviceData._id
                );
                this.logger.log(result, 'Customer Updated');
                return oemData;
              } else {
                this.logger.log('Could not find Oem');
                throw new NotFoundException('Could not find Oem');
              }
            } else {
              throw new NotFoundException('Incorrect Password');
            }
          } else {
            throw new NotFoundException(
              'device : status is != TRUE and active is != false'
            );
          }
        } else {
          this.logger.log('Could not find Oem');
          throw new NotFoundException(`Could not find device with "${createDeviceApiDto.productType}" product type`);
        }
      } else {
        throw new NotFoundException('Could not find Device');
      }
    } catch (error) {
      this.logger.log('exception :' + error);
      throw new NotFoundException(error);
    }
  }
}
