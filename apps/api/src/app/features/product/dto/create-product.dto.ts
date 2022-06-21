import { ApiProperty } from '@nestjs/swagger';
import { CreateProductFeatureDto } from '../../product-feature/dto/create-product-feature.dto';
import { ProductFeature } from '../../product-feature/entities/product-feature.entity';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  numberOfUser: number;

  @ApiProperty()
  imageUrls: string;

  @ApiProperty({ type: [CreateProductFeatureDto] })
  features: ProductFeature[];

  @ApiProperty()
  armMessageToRead: string;

  @ApiProperty()
  disArmMessageToRead: string;

  @ApiProperty()
  sirenOnMessageToRead: string;

  @ApiProperty()
  sirenOffMessageToRead: string;

  @ApiProperty()
  armMessageToSend: string;

  @ApiProperty()
  disArmMessageToSend: string;

  @ApiProperty()
  sirenOnMessageToSend: string;

  @ApiProperty()
  sirenOffMessageToSend: string;

  @ApiProperty()
  armedHighlightImage: string;

  @ApiProperty()
  disArmedHighlightImage: string;

  @ApiProperty()
  alertOnHighlightImage: string;

  @ApiProperty()
  alertOffHighlightImage: string;

  @ApiProperty()
  armedUnhighlightImage: string;

  @ApiProperty()
  disArmedUnhighlightImage: string;

  @ApiProperty()
  alertOnUnhighlightImage: string;

  @ApiProperty()
  alertOffUnhighlightImage: string;

  @ApiProperty()
  armSync: string;

  @ApiProperty()  
  disArmSync: string;

  @ApiProperty()  
  lockSync: string;
  
  @ApiProperty()  
  unlockSync: string;


  @ApiProperty()
  productManual: string;

}
