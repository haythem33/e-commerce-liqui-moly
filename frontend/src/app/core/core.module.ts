import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModule } from '../auth/auth.module';
import { ProductComponent } from './product/product.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { AdminSideBarComponent } from './admin-side-bar/admin-side-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    NavbarComponent,
    AdminSideBarComponent,
    ProductComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    AuthModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    HttpClientModule,
  ],
  exports: [
    NavbarComponent,
    AdminSideBarComponent,
    FooterComponent,
    ProductComponent,
  ],
  providers: [ProductService],
})
export class CoreModule {}
