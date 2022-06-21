import { CategoryModel } from '../../model/category.model';
import { ProductModel } from '../../model/product.model';
import { SensorModel } from '../../model/sensor.model';

export type addOemTableModelArray =
  | CategoryModel[]
  | ProductModel[]
  | SensorModel[];

export type addOemTableModelIndividual =
  | CategoryModel
  | ProductModel
  | SensorModel;
