import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [HomeComponent, AboutUsComponent, ContactUsComponent],
  imports: [CommonModule, ClientRoutingModule, CoreModule],
})
export class ClientModule {}
