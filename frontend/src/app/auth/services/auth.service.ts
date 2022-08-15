import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Auth_Modal_Component } from '../auth-modal/auth-modal.component';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  User,
  UserCredential,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MissingInformationComponent } from '../missing-information/missing-information.component';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public dialog: MatDialog,
    private fireAuth: Auth,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}
  open_auth_dialog(): void {
    this.dialog.open(Auth_Modal_Component, {
      width: '70%',
    });
  }
  open_missing_information_dialog(data?: {
    type: 'LOGIN' | 'REGISTER';
    user: User;
  }): void {
    this.dialog.open(MissingInformationComponent, {
      width: '45%',
      data: data,
    });
  }
  google_login(): Observable<UserCredential> {
    return from(signInWithPopup(this.fireAuth, new GoogleAuthProvider()));
  }
  native_login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.fireAuth, email, password));
  }
  create_user(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.fireAuth, email, password));
  }
  send_user_login(user: any): Observable<any> {
    return this.http.post(environment.server_url + '/auth/login', user).pipe(
      catchError((err) =>
        throwError(() => {
          return { user: user, stack: err.error };
        })
      )
    );
  }
  send_user_register(user: User): Observable<any> {
    return this.http
      .post(environment.server_url + '/auth/register', user, {
        responseType: 'text',
      })
      .pipe(
        catchError((err) =>
          throwError(() => {
            return { user: user, stack: err.error };
          })
        )
      );
  }
}
