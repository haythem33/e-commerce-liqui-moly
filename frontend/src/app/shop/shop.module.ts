import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [ListProductComponent, DetailProductComponent],
  imports: [CommonModule, ShopRoutingModule, CoreModule],
})
export class ShopModule {}
