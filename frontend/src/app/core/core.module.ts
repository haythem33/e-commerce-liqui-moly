import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ChartComponent } from './chart/chart.component';
import { AuthModule } from '../auth/auth.module';
import { AdminSideBarComponent } from './admin-side-bar/admin-side-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [NavbarComponent, ChartComponent, AdminSideBarComponent],
  imports: [
    CommonModule,
    AuthModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [NavbarComponent, AdminSideBarComponent, ChartComponent],
})
export class CoreModule {}
