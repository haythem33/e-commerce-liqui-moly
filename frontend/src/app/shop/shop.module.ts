import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { CoreModule } from '../core/core.module';
import { WhishListComponent } from './whish-list/whish-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ShopService } from './services/shop.service';

@NgModule({
  declarations: [
    ListProductComponent,
    DetailProductComponent,
    WhishListComponent,
  ],
  imports: [CommonModule, ShopRoutingModule, HttpClientModule, CoreModule],
  providers: [ShopService],
})
export class ShopModule {}
