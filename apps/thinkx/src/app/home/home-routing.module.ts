import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeviceComponent } from './device/device.component';
import { HomeComponent } from './home.component';
import { OemModule } from './oem/oem.module';
import { ProductModule } from './product/product.module';
import { SensorModule } from './sensor/sensor.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'oem',
        loadChildren: () => import('./oem/oem.module').then(m => m.OemModule)
      },
      {
        path: 'customer',
        component: CustomerComponent,
      },
      {
        path: 'sensor',
        loadChildren: () => import('./sensor/sensor.module').then(m => m.SensorModule)
      },
      {
        path: 'device',
        component: DeviceComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
