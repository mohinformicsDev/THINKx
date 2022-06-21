import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SensorFeatureService } from './sensor-feature.service';
import { CreateSensorFeatureDto } from './dto/create-sensor-feature.dto';
import { UpdateSensorFeatureDto } from './dto/update-sensor-feature.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('sensor-feature')
@Controller('sensor-feature')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class SensorFeatureController {
  constructor(private readonly sensorFeatureService: SensorFeatureService) { }

  @Post()
  @ApiBody({ type: CreateSensorFeatureDto })
  create(@Body() createSensorFeatureDto: CreateSensorFeatureDto) {
    return this.sensorFeatureService.create(createSensorFeatureDto);
  }

  @Get()
  findAll() {
    return this.sensorFeatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorFeatureService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSensorFeatureDto: UpdateSensorFeatureDto
  ) {
    return this.sensorFeatureService.update(id, updateSensorFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorFeatureService.remove(id);
  }
}
