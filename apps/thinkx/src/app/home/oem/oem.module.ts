import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddOemFormComponent } from './add-oem-form/add-oem-form.component';
import { AddOemMatTableComponent } from './add-oem-mat-table/add-oem-mat-table.component';
import { EditOemFormComponent } from './edit-oem-form/edit-oem-form.component';
import { OemListComponent } from './oem-list/oem-list.component';
import { OemRoutingModule } from './oem-routing.module';

@NgModule({
  declarations: [
    OemListComponent,
    AddOemFormComponent,
    EditOemFormComponent,
    AddOemMatTableComponent,
  ],
  imports: [OemRoutingModule, SharedModule.forRoot()],
})
export class OemModule { }
