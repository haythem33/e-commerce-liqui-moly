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
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, first, from, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MissingInformationComponent } from '../missing-information/missing-information.component';
import { Store } from '@ngrx/store';
import { signIn, signOut } from './auth.actions';
import { user_shop } from 'src/app/models/user-shop.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public dialog: MatDialog,
    private fireAuth: Auth,
    private http: HttpClient,
    private store: Store
  ) {
    this.check_current_user();
  }
  open_auth_dialog(): void {
    this.dialog.open(Auth_Modal_Component, {
      width: '70%',
    });
  }
  open_missing_information_dialog(data?: {
    type: 'LOGIN' | 'REGISTER';
    user: user_shop;
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
  get_user(email: string): Observable<{ message: string; user: user_shop }> {
    return this.http.get<{ message: string; user: user_shop }>(
      `${environment.server_url}/auth/currentUser/${email}`
    );
  }
  check_current_user() {
    this.fireAuth.onAuthStateChanged((user) => {
      user
        ? this.get_user(user.email as string)
            .pipe(first())
            .subscribe({
              next: (msg) => this.store.dispatch(signIn(msg.user)),
            })
        : this.store.dispatch(signOut());
    });
  }
  async logout() {
    await this.fireAuth.signOut();
  }
}
