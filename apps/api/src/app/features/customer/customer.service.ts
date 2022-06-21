import { Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EncryptionService } from '../../encryption/encryption.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './entities/customer.entity';

export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
    private encryptionService: EncryptionService
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto
  ): Promise<CustomerDocument> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  register(createCustomerDto: RegisterCustomerDto): Promise<CustomerDocument> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  findAll(): Promise<CustomerDocument[]> {
    return this.customerModel
      .find()
      .populate('devices')
      .populate('productType')
      .exec();
  }

  async findOne(id: string) {
    try {
      const result = await this.customerModel.findOne({ _id: id }).exec();

      if (!result) {
        throw new NotFoundException('Could not find the customer.');
      }
      return result as CustomerDocument;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the customer.');
    }
  }

  findByEmail(email: string) {
    return this.customerModel.findOne({ email: email });
  }

  async findByMobile(mobile: string) {
    try {
      const result = await this.customerModel
        .findOne({ mobile: mobile })
        .exec();
      if (!result) {
        throw new NotFoundException(
          'Could not find the customer mobile number.'
        );
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the customer.');
    }
  }

  async findOneByMobileNumberAndPassword(mobile: string, password: string) {
    try {
      const result = await this.customerModel
        .find({ mobile: mobile, password: password })
        .exec();

      if (result.length === 0) {
        throw new NotFoundException('Could not find the customer.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the customer.');
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const result = await this.customerModel
        .updateOne({ _id: id }, updateCustomerDto)
        .exec();
      if (result.n === 0) {
        throw new NotFoundException('could not find customer to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the customer to update.');
    }
  }

  async updateVerifyStatus(mobile: string, verifiedStatus: boolean) {
    try {
      const result = await this.customerModel
        .updateOne({ mobile: mobile }, { verifiedStatus: verifiedStatus })
        .exec();
      if (result.n === 0) {
        throw new NotFoundException('could not find customer to update.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the customer to update.');
    }
  }

  async remove(id: string) {
    try {
      const result = await this.customerModel.deleteOne({ _id: id }).exec();

      if (result.n === 0) {
        throw new NotFoundException('Could not find the customer to delete.');
      }
      return result;
    } catch (error) {
      this.logger.log(error);
      throw new NotFoundException('Could not find the customer to delete.');
    }
  }

  async totalCount() {
    return this.customerModel.countDocuments();
  }

  updateCustomerDevice(customerId: string, device: string) {
    return this.customerModel.updateOne(
      { _id: customerId },
      { $push: { devices: device } }
    );
  }
}
