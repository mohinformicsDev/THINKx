import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { OemService } from './oem.service';
import { CreateOemDto } from './dto/create-oem.dto';
import { UpdateOemDto } from './dto/update-oem.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('oem')
@Controller('oem')
export class OemController {
  private readonly logger = new Logger(OemController.name);

  constructor(private readonly oemService: OemService) {}

  @Post()
  @ApiBody({ type: CreateOemDto })
  create(@Body() createOemDto: CreateOemDto) {
    return this.oemService.create(createOemDto);
  }

  @Get()
  findAll() {
    return this.oemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oemService.findOne(id);
  }

  @Get('oem-id/:oemId')
  async findByOemId(@Param('oemId') oemId: string) {
    try {
      let oem = await this.oemService.findByOemId(oemId);
      let oemData = {
        id: '1',
        oemName: oem.oemName,
        oemId: oem.oemId,
        bugReportEmail: oem.bugReportEmail,
        endUserAgreement: oem.endUserAgreement,
        productProfile: oem.productProfile,
        companyProfile: oem.companyProfile,
        userManualLink: oem.userManualLink,
        status: oem.status,
        oemLogo: oem.oemLogo,
        marketingImageUrl: [...oem.marketingImageUrl],
        category: [...oem.category],
        product: oem.product.map((x, index) => {
          x['product_id'] = x['_id'];
          x['_id'] = (index + 1).toString();
          x.features = x.features?.map((x, index) => {
            x['_id'] = (index + 1).toString();
            return x;
          });
          return x;
        }),
        sensor: oem.sensor?.map((x, index) => {
          x['_id'] = (index + 1).toString();
          x.features = x.features?.map((x, index) => {
            x['_id'] = (index + 1).toString();
            return x;
          });
          return x;
        }),
      };
      return oemData;
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOemDto: UpdateOemDto) {
    return this.oemService.update(id, updateOemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oemService.remove(id);
  }
}
