import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptionModule } from '../../encryption/encryption.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer, CustomerSchema } from './entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { environment } from 'apps/api/src/environments/environment';

@Module({
  imports: [
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: Customer.name,
    //     useFactory: async () => {
    //       const schema = CustomerSchema;

    //       schema.pre<Customer>('save', function (next: Function) {
    //         const user = this;
    //         if (user.password) {
    //           bcrypt.genSalt(10, function (err, salt) {
    //             if (err) return next(err);

    //             bcrypt.hash(user.password, salt, (err, hash) => {
    //               if (err) return next(err);

    //               user.password = hash;
    //               next();
    //             });
    //           })
    //         }
    //       });
    //       return schema;
    //     }
    //   }
    // ]),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    EncryptionModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
