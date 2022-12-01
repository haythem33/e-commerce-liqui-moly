import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StoreModule } from '@ngrx/store';
import { ClientReducers } from './services/client.reducers';
import { CartModule } from '../cart/cart.module';

@NgModule({
  declarations: [HomeComponent, AboutUsComponent, ContactUsComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    CoreModule,
    CartModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    StoreModule.forFeature('clientFeature', ClientReducers),
  ],
})
export class ClientModule {}
