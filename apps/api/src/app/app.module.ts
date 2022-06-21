import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { EncryptionModule } from './encryption/encryption.module';
import { CategoryModule } from './features/category/category.module';
import { CustomerModule } from './features/customer/customer.module';
import { DeviceModule } from './features/device/device.module';
import { OemModule } from './features/oem/oem.module';
import { ProductFeatureModule } from './features/product-feature/product-feature.module';
import { ProductModule } from './features/product/product.module';
import { SensorFeatureModule } from './features/sensor-feature/sensor-feature.module';
import { SensorModule } from './features/sensor/sensor.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'thinkx'),
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: environment.atlasUri,
        useNewUrlParser: true,
        useCreateIndex: true,
      }),
    }),
    MulterModule.register({ dest: './images' }),
    CategoryModule,
    ProductModule,
    OemModule,
    DeviceModule,
    SensorModule,
    CustomerModule,
    ProductFeatureModule,
    SensorFeatureModule,
    AuthModule,
    EncryptionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // },
  ],
})
export class AppModule {}

9377195745;
