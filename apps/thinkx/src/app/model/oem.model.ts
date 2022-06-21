import { CategoryModel } from './category.model';
import { ProductModel } from './product.model';
import { SensorModel } from './sensor.model';

export interface OemModel {
  _id: string;
  oemName: string;
  oemId: string;
  bugReportEmail: string;
  endUserAgreement: string;
  productProfile: string[];
  companyProfile: string[];
  userManualLink: string[];
  status: true;
  oemLogo: string;
  marketingImageUrl: string[];
  category: CategoryModel[]; // use category model
  product: ProductModel[]; // use product model
  sensor: SensorModel[]; // use sensor model
  // remove addOemMatTableModel
}
