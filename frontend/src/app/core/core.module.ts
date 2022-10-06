import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ChartComponent } from './chart/chart.component';
import { AuthModule } from '../auth/auth.module';
import { ProductComponent } from './product/product.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ChartComponent,
    ProductComponent,
    FooterComponent,
  ],
  imports: [CommonModule, AuthModule],
  exports: [NavbarComponent, FooterComponent],
})
export class CoreModule {}
