import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../product/product.service';
import { DeviceService } from './device.service';
import { CreateDeviceApiDto } from './dto/create-device-api.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { SyncDevice } from './dto/sync-field.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@ApiTags('device')
@Controller('device')
export class DeviceController {
  private readonly logger = new Logger(DeviceController.name);

  constructor(
    private readonly deviceService: DeviceService,
    private readonly productService: ProductService
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(@Body() createDeviceDto: CreateDeviceDto) {
    try {
      let deviceExist = await this.deviceService.findByDeviceId(
        createDeviceDto.deviceId
      );
      this.logger.log(deviceExist, 'deviceExist');

      if (deviceExist) {
        throw 'Device id already exist';
      }
      return this.deviceService.create(createDeviceDto);
    } catch (error) {
      this.logger.log(error);
      throw new HttpException(error, 422);
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('import')
  @ApiBody({ type: [CreateDeviceDto] })
  async importDevice(@Body() createDeviceDto: Array<CreateDeviceDto>) {
    try {
      let validData: Array<CreateDeviceDto> = [];

      // check if all device id exist
      for (let i = 0; i < createDeviceDto.length; i++) {
        const element = createDeviceDto[i];
        let deviceExist = await this.deviceService.findByDeviceId(
          element.deviceId
        );
        if (!deviceExist) {
          validData.push(createDeviceDto[i]);
        }
      }
      // check if given product exist
      let product = await this.productService.findAll();
      // product[0].name = '';
      this.logger.log(product, 'product');
      validData = validData
        .filter((device) => {
          let index = product.findIndex((prod) => {
            this.logger.log(
              prod.name + '==' + device.productType,
              'device and product'
            );
            return prod.name == device.productType;
          });
          this.logger.log(
            !isNaN(Date.parse(device.manufactureDate)),
            'Date validation'
          );

          this.logger.log(index > 0, 'product index');

          if (index > -1 && !isNaN(Date.parse(device.manufactureDate))) {
            if (isNaN(Date.parse(device.manufactureDate))) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        })
        .map((data) => {
          let index = product.findIndex(
            (prod) => prod.name == data.productType
          );
          data.productType = product[index]._id;
          return data;
        });

      this.logger.log(validData.length, 'valid data length');
      if (validData.length == 0) {
        throw 'invalid data';
      }
      return this.deviceService.importDevice(validData);
    } catch (error) {
      this.logger.log(error);
      throw new HttpException(error, 422);
    }
  }

  @Get('sync-fields/:deviceId')
  @ApiBody({ type: [SyncDevice] })
  getSyncData(@Param('deviceId') deviceId: string, @Body() data: SyncDevice) {
    return data;
  }

  @Post('sync-fields/:deviceId')
  @ApiBody({ type: [SyncDevice] })
  saveSyncData(@Param('deviceId') deviceId: string, @Body() data: SyncDevice) {
    return data;
  }

  @Get()
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = this.deviceService.findOne(id);
      if (!result) {
        this.logger.log('could not find the device : ');
        throw new NotFoundException('Could not find the device.');
      }
      return result;
    } catch (error) {
      this.logger.log(error, 'Exception');
      throw new NotFoundException('Exception : Could not find the device');
    }
  }

  // @Get('/device/:deviceId')
  // findOneById(@Param('deviceId') deviceId: string) {
  //   return this.deviceService.findOneByDeviceId(deviceId);
  // }

  @Get('/device/:deviceId')
  async findOneByDeviceId(@Param('deviceId') deviceId: string) {
    try {
      const result = this.deviceService.findByDeviceId(deviceId);
      if (!result) {
        this.logger.log('could not find the device : ');
        throw new NotFoundException('Could not find the device.');
      }
      return result;
    } catch (error) {
      this.logger.log(error, 'Exception');
      throw new NotFoundException('Exception : Could not find the device');
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    this.logger.log(updateDeviceDto, 'updateDeviceDto');
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceService.remove(id);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('register')
  @ApiBody({ type: CreateDeviceApiDto })
  register(@Body() createDeviceApiDto: CreateDeviceApiDto) {
    return this.deviceService.register(createDeviceApiDto);
  }
}
