import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from '@thinkx/api-interfaces';
import { CustomerService } from './features/customer/customer.service';
import { DeviceService } from './features/device/device.service';
import { OemService } from './features/oem/oem.service';
import { ProductService } from './features/product/product.service';

@Injectable()
export class AppService {
  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private deviceService: DeviceService,
    private oemService: OemService
  ) { }
  getData(): Message {
    return { message: 'Welcome to api!' };
  }

  async getDashboard() {
    try {
      const customer = await this.customerService.totalCount();
      const product = await this.productService.totalCount();
      const device = await this.deviceService.totalCount();
      const oem = await this.oemService.totalCount();
      return {
        customer: customer,
        product: product,
        device: device,
        oem: oem,
      };
    } catch (error) {
      throw new NotFoundException('Could not find the dashboard.');
    }
  }
}
