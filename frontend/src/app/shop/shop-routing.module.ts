import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ListProductComponent } from './list-product/list-product.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-product',
    pathMatch: 'full',
  },
  {
    path: 'list-product',
    component: ListProductComponent,
  },
  {
    path: 'detail-product',
    component: DetailProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
