import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthComponent } from './auth.component';
import { AuthService } from './services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth_Modal_Component } from './auth-modal/auth-modal.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { MissingInformationComponent } from './missing-information/missing-information.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    Auth_Modal_Component,
    MissingInformationComponent,
  ],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatStepperModule,
    provideFirebaseApp(() => initializeApp(environment.firebase_config)),
    provideAuth(() => getAuth()),
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  exports: [AuthComponent],
  providers: [
    AuthService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase_config },
  ],
})
export class AuthModule {}
