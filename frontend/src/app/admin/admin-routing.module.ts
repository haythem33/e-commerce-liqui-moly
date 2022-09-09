import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarsPartsComponent } from './add-cars-parts/add-cars-parts.component';

const routes: Routes = [
  {
    path: '',
    component: AddCarsPartsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
