import { Pipe, PipeTransform } from '@angular/core';
import { ProductModel } from '../../model/product.model';

@Pipe({ name: 'getProductName' })
export class ProductNameFindPipe implements PipeTransform {
  transform(id: string, products: ProductModel[]) {
    let product = products.find((x) => x._id == id);
    if (product) {
      return product.name;
    }
    return 'INVALID PRODUCT TYPE';
  }
}
