import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppController } from '../app.controller';
import { CustomerService } from '../features/customer/customer.service';
import { CreateCustomerDto } from '../features/customer/dto/create-customer.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  @Post('register')
  async registerCustomer(@Body() body: CreateCustomerDto) {
    try {
      this.logger.log('asd', 'data');

      let data = await this.customerService.create(body);
      this.logger.log(data, 'data');
      return data;
    } catch (error) {
      this.logger.log(error, 'error');
    }
  }

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @ApiBody({ type: LoginDto })
  @UseGuards(AdminAuthGuard)
  @Post('admin/login')
  adminLogin(@Req() req) {
    this.logger.log('data');
    return this.authService.login(req.user);
  }
}
