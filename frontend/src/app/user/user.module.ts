import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { GarageComponent } from './garage/garage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { CartModule } from '../cart/cart.module';
import { MatButtonModule } from '@angular/material/button';
import { ShopModule } from '../shop/shop.module';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
  declarations: [
    OrderTrackingComponent,
    GarageComponent,
    DashboardComponent,
    GeneralInformationComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CartModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatIconModule,
    MatSnackBarModule,
    MatStepperModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    PdfViewerModule,
    ShopModule,
  ],
})
export class UserModule {}
