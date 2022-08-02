import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog';
import { Auth_Modal_Component } from '../auth-modal/auth-modal.component';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
  sendEmailVerification,
} from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MissingInformationComponent } from '../missing-information/missing-information.component';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private Auth_Dialog_Ref!: MatDialogRef<Auth_Modal_Component>;
  private Missing_Information_Ref!: MatDialogRef<MissingInformationComponent>;
  constructor(
    public dialog: MatDialog,
    private fireAuth: Auth,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  public open_auth_dialog(data?: any): MatDialogRef<Auth_Modal_Component> {
    this.Auth_Dialog_Ref = this.dialog.open(Auth_Modal_Component, {
      width: '800px',
      data: { ...data },
    });
    return this.Auth_Dialog_Ref;
  }
  public open_missing_information_dialog(
    user: User
  ): MatDialogRef<MissingInformationComponent> {
    if (this.Auth_Dialog_Ref.getState() === MatDialogState.OPEN) {
      this.Auth_Dialog_Ref.close();
    }
    this.Missing_Information_Ref = this.dialog.open(
      MissingInformationComponent,
      {
        width: '800px',
        data: { ...user },
      }
    );
    return this.Missing_Information_Ref;
  }
  public async goole_login(): Promise<any> {
    try {
      let userCredential: UserCredential = await signInWithPopup(
        this.fireAuth,
        new GoogleAuthProvider()
      );
      let user = { ...userCredential.user, provider: 'GOOGLE' };
      return { userCredential: user, observable: this.send_user_data(user) };
    } catch (error) {
      this.snackBar.open(`CONNEXION ECHOUE`, 'Dismiss', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }

  public facebook_login(): Promise<UserCredential> {
    return signInWithPopup(this.fireAuth, new FacebookAuthProvider());
  }
  public async sendVerificationMail(user: User): Promise<void> {
    await sendEmailVerification(user);
    this.snackBar
      .open(
        `UN E-MAIL DE CONFIRMATION A ÉTÉ ENVOYÉ A L'ADRESSE ${user.email}`,
        'Dismiss',
        {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        }
      )
      .afterDismissed()
      .subscribe(() => this.Auth_Dialog_Ref.close());
  }

  public send_user_data(user: User): Observable<any> {
    return this.http.post(environment.server_url + '/auth/login', user, {
      responseType: 'text',
    });
  }
  public handleLoginError(error: any, user: User): void {
    if (error.message === 'ACCOUNT NOT CONFIRMED') {
      this.sendVerificationMail(user);
      return;
    }
    if (error.message === 'MISSING INFORMATION') {
      this.open_missing_information_dialog(user);
      return;
    }
    if (error.message === 'USER NOT FOUND') {
      this.snackBar.open(
        "AUCUN COMPTE N'A ETE TROUVE AVEC CETTE ADRESSE MAIL",
        'Dismiss',
        {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        }
      );
    }
  }
}
