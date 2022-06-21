import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';
import { EditProductFormComponent } from './edit-product-form/edit-product-form.component';
import { ProductFeatureModule } from './product-feature/product-feature.module';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: 'add',
        component: AddProductFormComponent,
      },
      {
        path: 'edit',
        redirectTo: '',
      },
      {
        path: 'edit/:id',
        component: EditProductFormComponent,
      },
      {
        path: 'feature',
        loadChildren: () => import('./product-feature/product-feature.module').then(m => m.ProductFeatureModule)
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule { }
