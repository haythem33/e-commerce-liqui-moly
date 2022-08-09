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
  createUserWithEmailAndPassword,
  User,
  UserCredential,
  signInWithEmailAndPassword,
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
      width: '70%',
      data: { ...data },
    });
    return this.Auth_Dialog_Ref;
  }

  public open_missing_information_dialog(
    user: User
  ): MatDialogRef<MissingInformationComponent> {
    this.Missing_Information_Ref = this.dialog.open(
      MissingInformationComponent,
      {
        width: '800px',
        data: { ...user },
      }
    );
    return this.Missing_Information_Ref;
  }

  public async google_login(): Promise<any> {
    try {
      let userCredential: UserCredential = await signInWithPopup(
        this.fireAuth,
        new GoogleAuthProvider()
      );
      return { ...userCredential.user, provider: 'GOOGLE' };
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

  public async native_login(user_info: any): Promise<any> {
    let { email, password } = user_info;
    try {
      let userCredential = await signInWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );
      return { ...userCredential.user, provider: 'INTERNAL' };
    } catch (error) {
      return;
    }
  }

  public async create_account(user: any): Promise<any> {
    let { email, password } = user;
    try {
      let userCredential: UserCredential = await createUserWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );
      return { ...userCredential.user, provider: 'INTERNAL' };
    } catch (error) {
      this.snackBar.open(
        `UN COMPTE ET DEJA ASSOCIE AVEC CETTE ADRESSE`,
        'Dismiss',
        {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        }
      );
      return;
    }
  }

  public send_user_data(
    user: User,
    type: 'REGISTER' | 'LOGIN'
  ): Observable<any> {
    if (type === 'REGISTER') {
      return this.http.post(environment.server_url + '/auth/register', user, {
        responseType: 'text',
      });
    }
    return this.http.post(environment.server_url + '/auth/login', user, {
      responseType: 'text',
    });
  }
}
