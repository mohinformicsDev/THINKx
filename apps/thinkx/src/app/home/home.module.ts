import { NgModule } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SharedModule } from '../shared/shared.module';

import { AddCategoryFormComponent } from './category/add-category-form/add-category-form.component';
import { CategoryComponent } from './category/category.component';
import { ColumnFilterComponent } from './customer/column-filter/column-filter.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDeviceFormComponent } from './device/add-device-form/add-device-form.component';
import { DeviceComponent } from './device/device.component';
import { ExcelDataDisplayComponent } from './device/excel-data-display/excel-data-display.component';
import { ProductNameFindPipe } from './device/product-name.pipe';
import { FilterItemDirective } from './filter-item.directive';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SettingComponent } from './setting/setting.component';
import { AddFeatureTypeFormComponent } from './setting/add-feature-type-form/add-feature-type-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    FilterItemDirective,
    DashboardComponent,
    CategoryComponent,
    DeviceComponent,
    AddCategoryFormComponent,
    CustomerComponent,
    ColumnFilterComponent,
    AddDeviceFormComponent,
    ExcelDataDisplayComponent,
    ProductNameFindPipe,
    SettingComponent,
    AddFeatureTypeFormComponent,
  ],
  imports: [HomeRoutingModule, SharedModule.forRoot()],
  providers: [AuthService],
})
export class HomeModule {}
