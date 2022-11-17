import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { GarageComponent } from './garage/garage.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { CartModule } from '../cart/cart.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    OrderTrackingComponent,
    GarageComponent,
    OrderHistoryComponent,
    DashboardComponent,
    GeneralInformationComponent,
  ],
  imports: [CommonModule, UserRoutingModule, CartModule, MatButtonModule],
})
export class UserModule {}
