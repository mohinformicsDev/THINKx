import { CategoryModel } from '../../model/category.model';
import { CustomerModel } from '../../model/customer.model';
import { DashboardModel } from '../../model/dashboard.model';
import { DeviceModel } from '../../model/device.model';
import { OemModel } from '../../model/oem.model';
import { ProductFeatureModel } from '../../model/product-feature.model';
import { ProductModel } from '../../model/product.model';
import { SensorFeatureModel } from '../../model/sensor-feature.model';
import { SensorModel } from '../../model/sensor.model';
import { ImageUploadResponse } from '../image-drag-drop/Image-upload-response.model';

export type modelTypeIndividual =
  | CategoryModel
  | SensorModel
  | ProductModel
  | DeviceModel
  | OemModel
  | CustomerModel
  | OemModel
  | ProductFeatureModel
  | SensorFeatureModel
  | ImageUploadResponse
  | DashboardModel;
