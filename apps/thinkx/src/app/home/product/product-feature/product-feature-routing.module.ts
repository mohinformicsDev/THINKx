import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductFeatureFormComponent } from './add-product-feature-form/add-product-feature-form.component';
import { EditProductFeatureFormComponent } from './edit-product-feature-form/edit-product-feature-form.component';
import { ProductFeatureListComponent } from './product-feature-list/product-feature-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductFeatureListComponent,
      },
      {
        path: 'add',
        component: AddProductFeatureFormComponent,
      },
      {
        path: 'edit',
        redirectTo: '',
      },
      {
        path: 'edit/:id',
        component: EditProductFeatureFormComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductFeatureRoutingModule {}
