import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSensorFeatureFormComponent } from './add-sensor-feature-form/add-sensor-feature-form.component';
import { EditSensorFeatureFormComponent } from './edit-sensor-feature-form/edit-sensor-feature-form.component';
import { SensorFeatureListComponent } from './sensor-feature-list/sensor-feature-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SensorFeatureListComponent,
      },
      {
        path: 'add',
        component: AddSensorFeatureFormComponent,
      },
      {
        path: 'edit',
        redirectTo: '',
      },
      {
        path: 'edit/:id',
        component: EditSensorFeatureFormComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SensorFeatureRoutingModule {}
