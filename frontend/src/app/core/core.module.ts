import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModule } from '../auth/auth.module';
import { ProductComponent } from './product/product.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [NavbarComponent, ProductComponent, FooterComponent],
  imports: [CommonModule, AuthModule, RouterModule],
  exports: [NavbarComponent, FooterComponent],
})
export class CoreModule {}
