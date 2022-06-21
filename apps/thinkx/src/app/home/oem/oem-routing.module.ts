import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOemFormComponent } from './add-oem-form/add-oem-form.component';
import { EditOemFormComponent } from './edit-oem-form/edit-oem-form.component';
import { OemListComponent } from './oem-list/oem-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OemListComponent,
      },
      {
        path: 'add',
        component: AddOemFormComponent,
      },
      {
        path: 'edit',
        redirectTo: '',
      },
      {
        path: 'edit/:id',
        component: EditOemFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OemRoutingModule {}
