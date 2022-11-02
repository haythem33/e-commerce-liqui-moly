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
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CartButtonComponent, CheckoutComponent, CartListComponent],
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
    StoreModule.forFeature('cartFeature', CartReducers),
  ],
  exports: [CartButtonComponent],
  providers: [CartService],
})
export class CartModule {}
