import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AddSensorFeatureFormComponent } from './add-sensor-feature-form/add-sensor-feature-form.component';
import { EditSensorFeatureFormComponent } from './edit-sensor-feature-form/edit-sensor-feature-form.component';
import { SensorFeatureListComponent } from './sensor-feature-list/sensor-feature-list.component';
import { SensorFeatureRoutingModule } from './sensor-feature-routing.module';

@NgModule({
  declarations: [
    SensorFeatureListComponent,
    AddSensorFeatureFormComponent,
    EditSensorFeatureFormComponent,
  ],
  imports: [SensorFeatureRoutingModule, SharedModule.forRoot(),],
})
export class SensorFeatureModule {}
