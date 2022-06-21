import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';
import { EditProductFormComponent } from './edit-product-form/edit-product-form.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [
    ProductListComponent,
    AddProductFormComponent,
    EditProductFormComponent,
  ],
  imports: [ProductRoutingModule, SharedModule],
})
export class ProductModule {}
