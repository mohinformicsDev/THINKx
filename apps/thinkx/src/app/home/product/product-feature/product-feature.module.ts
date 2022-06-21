import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AddProductFeatureFormComponent } from './add-product-feature-form/add-product-feature-form.component';
import { EditProductFeatureFormComponent } from './edit-product-feature-form/edit-product-feature-form.component';
import { ProductFeatureListComponent } from './product-feature-list/product-feature-list.component';
import { ProductFeatureRoutingModule } from './product-feature-routing.module';

@NgModule({
  declarations: [
    ProductFeatureListComponent,
    AddProductFeatureFormComponent,
    EditProductFeatureFormComponent,
  ],
  imports: [ProductFeatureRoutingModule, SharedModule.forRoot()],
})
export class ProductFeatureModule {}
