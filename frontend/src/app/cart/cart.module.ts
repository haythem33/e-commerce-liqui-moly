import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartButtonComponent } from './cart-button/cart-button.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { StoreModule } from '@ngrx/store';
import { CartReducers } from './services/cart.reducers';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from './services/cart.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvoiceComponent } from './checkout/invoice/invoice.component';
import { EditAdresseComponent } from './checkout/edit-adresse/edit-adresse.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@NgModule({
  declarations: [
    CartButtonComponent,
    CheckoutComponent,
    CartListComponent,
    InvoiceComponent,
    EditAdresseComponent,
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatListModule,
    MatDividerModule,
    FormsModule,
    MatStepperModule,
    MatBottomSheetModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    PdfViewerModule,
    StoreModule.forFeature('cartFeature', CartReducers),
  ],
  exports: [CartButtonComponent],
  providers: [CartService],
})
export class CartModule {}
