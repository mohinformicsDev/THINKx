import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSensorFormComponent } from './add-sensor-form/add-sensor-form.component';
import { EditSensorFormComponent } from './edit-sensor-form/edit-sensor-form.component';
import { SensorFeatureModule } from './sensor-feature/sensor-feature.module';
import { SensorListComponent } from './sensor-list/sensor-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SensorListComponent,
      },
      {
        path: 'add',
        component: AddSensorFormComponent,
      },
      {
        path: 'edit',
        redirectTo: '',
      },
      {
        path: 'edit/:id',
        component: EditSensorFormComponent,
      },
      {
        path: 'feature',
        loadChildren: () => import('./sensor-feature/sensor-feature.module').then(m => m.SensorFeatureModule)
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SensorRoutingModule { }
