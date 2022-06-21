import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateQuery } from 'mongoose';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorDocument } from './entities/sensor.entity';
import { SensorService } from './sensor.service';

@ApiTags('sensor')
@Controller('sensor')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  @ApiBody({
    type: CreateSensorDto,
  })
  create(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorService.create(createSensorDto);
  }

  @Get()
  findAll() {
    return this.sensorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSensorDto: UpdateQuery<SensorDocument>
  ) {
    return this.sensorService.update(id, updateSensorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorService.remove(id);
  }
}
