import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { Category } from '../../category/entities/category.entity';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { Product } from '../../product/entities/product.entity';
import { CreateSensorDto } from '../../sensor/dto/create-sensor.dto';
import { Sensor } from '../../sensor/entities/sensor.entity';

// export class OemCategory {
//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   imageUrl: string
// }

// export class OemProduct {
//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   imageUrl: string
// }

// export class OemSensor {
//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   imageUrl: string
// }

export class CreateOemDto {
  @ApiProperty()
  oemName: string;

  @ApiProperty()
  oemId: string;

  @ApiProperty()
  bugReportEmail: string;

  @ApiProperty()
  endUserAgreement: string[];

  @ApiProperty()
  productProfile: string[];

  @ApiProperty()
  companyProfile: string[];

  @ApiProperty()
  userManualLink: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  oemLogo: string;

  @ApiProperty()
  marketingImageUrl: string[];

  @ApiProperty({ type: [CreateCategoryDto] })
  category: Category[];

  @ApiProperty({ type: [CreateProductDto] })
  product: Product[];

  @ApiProperty({ type: [CreateSensorDto] })
  sensor: Sensor[];
}
