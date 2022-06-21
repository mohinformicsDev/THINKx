import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from '../customer/customer.module';
import { OemModule } from '../oem/oem.module';
import { ProductModule } from '../product/product.module';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { Device, DeviceSchema } from './entities/device.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    OemModule,
    CustomerModule,
    ProductModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
