import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AddCarsPartsComponent } from './add-cars-parts/add-cars-parts.component';
import { CoreModule } from '../core/core.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ShopModule } from '../shop/shop.module';
import { MatButtonModule } from '@angular/material/button';
import { AdminServiceService } from './services/admin-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddCategoryComponent } from './add-category/add-category.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [AddCarsPartsComponent, AddCategoryComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    ShopModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  providers: [AdminServiceService],
})
export class AdminModule {}
