import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ChartComponent } from './chart/chart.component';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [NavbarComponent, ChartComponent],
  imports: [CommonModule, AuthModule],
  exports: [NavbarComponent],
})
export class CoreModule {}
