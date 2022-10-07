import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartButtonComponent } from './cart-button/cart-button.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [CartButtonComponent, CheckoutComponent, CartListComponent],
  imports: [CommonModule, CartRoutingModule, CoreModule],
  exports: [CartButtonComponent],
})
export class CartModule {}
