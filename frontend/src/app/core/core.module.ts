import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [NavbarComponent, ChartComponent],
  imports: [CommonModule],
  exports: [NavbarComponent],
})
export class CoreModule {}
