import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopService } from './services/shop.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, ShopRoutingModule, HttpClientModule],
  providers: [ShopService],
})
export class ShopModule {}
