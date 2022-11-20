import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GarageComponent } from './garage/garage.component';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'general-information',
        pathMatch: 'full',
      },
      {
        path: 'general-information',
        component: GeneralInformationComponent,
      },
      {
        path: 'order-tracking',
        component: OrderTrackingComponent,
      },
      {
        path: 'garage',
        component: GarageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
