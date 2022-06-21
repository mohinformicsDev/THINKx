import { CategoryModel } from './category.model';
import { ProductFeatureModel } from './product-feature.model';

export interface ProductModel {
  _id: string;
  name: string;
  numberOfUser: number;
  category: CategoryModel;
  imageUrls: string;
  features: ProductFeatureModel[];

  armMessageToRead: string;
  disArmMessageToRead: string;
  sirenOnMessageToRead: string;
  sirenOffMessageToRead: string;

  armMessageToSend: string;
  disArmMessageToSend: string;
  sirenOnMessageToSend: string;
  sirenOffMessageToSend: string;

  armSync: string;
  disArmSync: string;
  lockSync: string;
  unlockSync: string;

  armedHighlightImage: string;
  disArmedHighlightImage: string;
  alertOnHighlightImage: string;
  alertOffHighlightImage: string;
  armedUnhighlightImage: string;
  disArmedUnhighlightImage: string;
  alertOnUnhighlightImage: string;
  alertOffUnhighlightImage: string;
  
  productManual: string;
}
