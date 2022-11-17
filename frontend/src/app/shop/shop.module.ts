import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { CoreModule } from '../core/core.module';
import { WhishListComponent } from './whish-list/whish-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ShopService } from './services/shop.service';
import { StoreModule } from '@ngrx/store';
import { ClientReducers } from '../client/services/client.reducers';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { AddCarDialogComponent } from './add-car-dialog/add-car-dialog.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CartModule } from '../cart/cart.module';
@NgModule({
  declarations: [
    ListProductComponent,
    DetailProductComponent,
    WhishListComponent,
    AddCarDialogComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    HttpClientModule,
    CoreModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatSliderModule,
    FormsModule,
    MatBottomSheetModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    ScrollingModule,
    CartModule,
    StoreModule.forFeature('clientFeature', ClientReducers),
  ],
  providers: [ShopService],
  exports: [AddCarDialogComponent],
})
export class ShopModule {}
