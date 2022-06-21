import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddSensorFormComponent } from './add-sensor-form/add-sensor-form.component';
import { EditSensorFormComponent } from './edit-sensor-form/edit-sensor-form.component';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { SensorRoutingModule } from './sensor-routing.module';

@NgModule({
  declarations: [
    SensorListComponent,
    AddSensorFormComponent,
    EditSensorFormComponent,
  ],
  imports: [SensorRoutingModule, SharedModule.forRoot()],
})
export class SensorModule {}
