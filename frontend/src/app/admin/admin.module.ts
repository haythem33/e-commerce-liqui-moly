import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AddCarsPartsComponent } from './add-cars-parts/add-cars-parts.component';
import { CoreModule } from '../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [AddCarsPartsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class AdminModule {}
