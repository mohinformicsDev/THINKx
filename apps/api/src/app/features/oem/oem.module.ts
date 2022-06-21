import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Oem, OemSchema } from './entities/oem.entity';
import { OemController } from './oem.controller';
import { OemService } from './oem.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Oem.name, schema: OemSchema }]),
  ],
  controllers: [OemController],
  providers: [OemService],
  exports: [OemService],
})
export class OemModule { }
