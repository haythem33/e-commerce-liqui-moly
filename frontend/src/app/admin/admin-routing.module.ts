import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarsPartsComponent } from './add-cars-parts/add-cars-parts.component';
import { AddCategoryComponent } from './add-category/add-category.component';

const routes: Routes = [
  {
    path: '',
    component: AddCarsPartsComponent,
  },
  {
    path: 'add-category',
    component: AddCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
